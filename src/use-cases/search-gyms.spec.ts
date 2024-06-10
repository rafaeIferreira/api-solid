import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymUseCase } from './search-gyms'

let gymsRepository: InMemoryGymsRepository
let sut: SearchGymUseCase

describe('Search Gyms Use Case', () => {
  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymUseCase(gymsRepository)

    // await gymsRepository.create({
    //   id: 'gym-01',
    //   title: 'JavaScript Gym',
    //   description: '',
    //   phone: '',
    //   latitude: -25.4377984,
    //   longitude: -49.2732416,
    // })
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      title: 'Javascript Gym',
      description: null,
      phone: null,
      latitude: -25.4377984,
      longitude: -49.2732416,
    })

    await gymsRepository.create({
      title: 'Typescript Gym',
      description: null,
      phone: null,
      latitude: -25.4377984,
      longitude: -49.2732416,
    })

    const { gyms } = await sut.execute({
      query: 'Javascript Gym',
      page: 1,
    })

    // to be equal to any string
    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Javascript Gym' })])
  })

  it('should be able to fetch paginated gym search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        title: `Javascript Gym ${i}`,
        description: null,
        phone: null,
        latitude: -25.4377984,
        longitude: -49.2732416,
      })
    }

    const { gyms } = await sut.execute({
      query: 'Javascript',
      page: 2,
    })
    console.log(gyms)

    // to be equal to any string
    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'Javascript Gym 21' }),
      expect.objectContaining({ title: 'Javascript Gym 22' }),
    ])
  })
})
