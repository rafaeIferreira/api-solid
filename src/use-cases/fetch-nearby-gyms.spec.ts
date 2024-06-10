import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: FetchNearbyGymsUseCase

describe('Fetch Nearby Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)

    // await gymsRepository.create({
    //   id: 'gym-01',
    //   title: 'JavaScript Gym',
    //   description: '',
    //   phone: '',
    //   latitude: -25.4377984,
    //   longitude: -49.2732416,
    // })
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      title: 'Near Gym',
      description: null,
      phone: null,
      latitude: -25.4377984,
      longitude: -49.2732416,
    })

    await gymsRepository.create({
      title: 'Far Gym',
      description: null,
      phone: null,
      latitude: -25.0907594,
      longitude: -49.0916485,
    })
    // -25.0907594,-49.0916485

    const { gyms } = await sut.execute({
      userLatitude: -25.4377984,
      userLongitude: -49.2732416,
    })

    // to be equal to any string
    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Near Gym' })])
  })
})
