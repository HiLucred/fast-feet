import { makeOrder } from 'test/factories/make-order'
import { FetchOrdersByNeighborhoodUseCase } from './fetch-orders-by-neighborhood'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: FetchOrdersByNeighborhoodUseCase

describe('Fetch Order By Neighborhood Use Case', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )
    sut = new FetchOrdersByNeighborhoodUseCase(inMemoryOrdersRepository)
  })

  it('should be able to fetch courier orders by neighborhood', async () => {
    const FAKE_COURIER_ID = new UniqueEntityId('fake-courier-id')

    const order = makeOrder({
      courierId: FAKE_COURIER_ID,
    })

    const orderFromAnotherNeighborhood = makeOrder({
      courierId: FAKE_COURIER_ID,
    })

    // Create 10 orders
    for (let i = 0; i < 10; i++) {
      inMemoryOrdersRepository.create(order)
    }

    // Create 10 orders from another neighborhood
    for (let i = 0; i < 10; i++) {
      inMemoryOrdersRepository.create(orderFromAnotherNeighborhood)
    }

    const result = await sut.execute({
      neighborhood: order.recipient.address.neighborhood,
      courierId: FAKE_COURIER_ID.toString,
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(result.value.orders).toHaveLength(10)
    }
  })

  it('should not be able to fetch courier orders from another courier', async () => {
    const FAKE_COURIER_ID = new UniqueEntityId('fake-courier-id')
    const FAKE_COURIER_ID_2 = new UniqueEntityId('fake-courier-id-2')

    const order = makeOrder({
      courierId: FAKE_COURIER_ID,
    })

    // Create 10 orders from courier 1
    for (let i = 0; i < 10; i++) {
      inMemoryOrdersRepository.create(order)
    }

    // Create 10 orders from courier 2
    for (let i = 0; i < 10; i++) {
      inMemoryOrdersRepository.create(
        makeOrder({
          courierId: FAKE_COURIER_ID_2,
        }),
      )
    }

    const result = await sut.execute({
      neighborhood: order.recipient.address.neighborhood,
      courierId: FAKE_COURIER_ID.toString,
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(result.value.orders).toHaveLength(10)
    }
  })
})
