import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { ValidateCheckinUseCase } from '../validate-check-in'

export function makeValidateCheckInUseCase() {
  const checkInRepository = new PrismaCheckInsRepository()
  const validateCheckInUseCase = new ValidateCheckinUseCase(checkInRepository)

  return validateCheckInUseCase
}
