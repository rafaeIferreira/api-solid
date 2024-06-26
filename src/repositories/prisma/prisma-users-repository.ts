import { prisma } from '../../lib/prisma'
import { Prisma } from '@prisma/client'
import { UsersRepository } from '../users-repository'

export class PrismaUsersRepository implements UsersRepository {
  async findByEmail(email: string) {
    const emailUser = prisma.user.findUnique({
      where: { email },
    })

    return emailUser
  }

  async findById(userId: string) {
    const user = prisma.user.findFirst({
      where: { id: userId },
    })
    if (!user) {
      return null
    }
    return user
  }

  async create(data: Prisma.UserCreateInput) {
    const user = await prisma.user.create({
      data,
    })

    return user
  }
}
