import { PrismaGymsRepository } from '@/repositories/prisma/prisma-gyms-repository'
import { CreateGymUseCase } from '../create-gym'

export function makeGetUserProfileUseCase() {
  const userRepository = new PrismaGymsRepository()
  const createhGymUseCase = new CreateGymUseCase(userRepository)

  return createhGymUseCase
}
