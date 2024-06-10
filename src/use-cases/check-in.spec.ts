import { expect, describe, it, beforeEach, vi, afterEach } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-users-checkIn-repository'
import { CheckinUseCase } from './check-in'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { Decimal } from '@prisma/client/runtime/library'
import { MaxNumberCheckInsError } from './errors/max-number-of-check-ins-error'
import { MaxDistanceError } from './errors/max-distance-error'

let checkInRepository: InMemoryCheckInsRepository
let sut: CheckinUseCase
let gymsRepository: InMemoryGymsRepository

describe('Check-in Use Case', () => {
  beforeEach(async () => {
    checkInRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckinUseCase(checkInRepository, gymsRepository)

    await gymsRepository.create({
      id: 'gym-01',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: -25.4377984,
      longitude: -49.2732416,
    })
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })
  // ,
  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -25.4377984,
      userLongitude: -49.2732416,
    })

    // to be equal to any string
    expect(checkIn.id).toEqual(expect.any(String))
    expect(checkIn.created_at).toBeInstanceOf(Date)
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -25.4377984,
      userLongitude: -49.2732416,
    })

    // to be equal to any string
    await expect(async () => {
      await sut.execute({
        userId: 'user-01',
        gymId: 'gym-01',
        userLatitude: -25.4377984,
        userLongitude: -49.2732416,
      })
    }).rejects.toBeInstanceOf(MaxNumberCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))
    await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -25.4377984,
      userLongitude: -49.2732416,
    })
    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))
    // to be equal to any string
    const { checkIn } = await sut.execute({
      userId: 'user-01',
      gymId: 'gym-01',
      userLatitude: -25.4377984,
      userLongitude: -49.2732416,
    })
    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    gymsRepository.items.push({
      id: 'gym-02',
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(-25.3661583),
      longitude: new Decimal(-49.0648447),
    })

    expect(async () => {
      await sut.execute({
        userId: 'user-01',
        gymId: 'gym-02',
        userLatitude: -25.4377984,
        userLongitude: -49.2732416,
      })
    }).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
