import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-users-checkIn-repository'
import { ValidateCheckinUseCase } from './validate-check-in'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let checkInRepository: InMemoryCheckInsRepository
let sut: ValidateCheckinUseCase

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckinUseCase(checkInRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })
  // ,
  it('should be able to validate check-in', async () => {
    const createdCheckIn = await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })

    const { checkIn } = await sut.execute({
      checkInId: createdCheckIn.id,
    })

    // to be equal to any string
    expect(checkIn.validated_at).toEqual(expect.any(Date))
    expect(checkInRepository.items[0].validated_at).toEqual(expect.any(Date))
  })

  it('should not be able to validate an inexistent check-in', async () => {
    // to be equal to any string
    await expect(() =>
      sut.execute({
        checkInId: 'inexistent-check-in-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to validate a check-in after 20 minutes of its creation', async () => {
    vi.setSystemTime(new Date(2024, 0, 1, 13, 40))
    const createdCheckIn = await checkInRepository.create({
      gym_id: 'gym-01',
      user_id: 'user-01',
    })
    const twentyOneMinutesInMs = 1000 * 60 * 21

    vi.advanceTimersByTime(twentyOneMinutesInMs)

    await expect(() =>
      sut.execute({
        checkInId: createdCheckIn.id,
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
