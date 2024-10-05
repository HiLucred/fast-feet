import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { FetchDeliveredOrdersByCourierUseCase } from './fetch-delivered-orders-by-courier'
import { makeOrder } from 'test/factories/make-order'
import { makeCourier } from 'test/factories/make-courier'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: FetchDeliveredOrdersByCourierUseCase

describe('Fetch Delivered Orders By Courier', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )
    sut = new FetchDeliveredOrdersByCourierUseCase(inMemoryOrdersRepository)
  })

  it('should be able fetch delivered orders by courier', async () => {
    const courier = makeCourier()

    for (let i = 1; i <= 10; i++) {
      // Create 10 Orders with "PickedUp" state
      inMemoryOrdersRepository.create(
        makeOrder({ courierId: courier.id, state: 'PickedUp' }),
      )
    }

    for (let i = 1; i <= 10; i++) {
      // Create 10 Orders with "Pending" state
      inMemoryOrdersRepository.create(
        makeOrder({ courierId: courier.id, state: 'Pending' }),
      )
    }

    for (let i = 1; i <= 5; i++) {
      // Create 5 Orders with "Delivered" state
      inMemoryOrdersRepository.create(
        makeOrder({ courierId: courier.id, state: 'Delivered' }),
      )
    }

    const result = await sut.execute({ courierId: courier.id.toString })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(result.value.orders).toHaveLength(5)
      expect(inMemoryOrdersRepository.orders).toHaveLength(25)
    }
  })
})
