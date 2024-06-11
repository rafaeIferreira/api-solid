import { PrismaCheckInsRepository } from '@/repositories/prisma/prisma-check-ins-repository'
import { FetchUserCheckInsHistory } from '../fetch-user-check-ins-history'

export function makeFetchUserCheckInsHistoryUseCase() {
  const checkInRepository = new PrismaCheckInsRepository()
  const fetchUserCheckInsUseCase = new FetchUserCheckInsHistory(
    checkInRepository,
  )

  return fetchUserCheckInsUseCase
}
