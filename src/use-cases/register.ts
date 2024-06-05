import { UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  // eslint-disable-next-line prettier/prettier
  constructor(private UsersRepository: UsersRepository) { }

  async execute({ name, email, password }: RegisterUseCaseRequest) {
    const password_hash = await hash(password, 6)
    const userWithSameEmail = await this.UsersRepository.findByEmail(email)
    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }
    await this.UsersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
