import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { FetchPendingOrdersByCourierUseCase } from './fetch-pending-orders-by-courier'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: FetchPendingOrdersByCourierUseCase

describe('Fetch Pending Orders By Courier Use Case', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )
    sut = new FetchPendingOrdersByCourierUseCase(inMemoryOrdersRepository)
  })

  it('should be able to fetch pending orders by courier', async () => {
    const fakeCourierId = 'fake-courier-id'

    // Create 10 Orders by courier
    for (let i = 1; i <= 10; i++) {
      inMemoryOrdersRepository.create(
        makeOrder({
          courierId: new UniqueEntityId(fakeCourierId),
          state: 'Pending', // "Pending" or "Picked Up" === Pending Order
        }),
      )
    }

    const result = await sut.execute({ courierId: fakeCourierId })

    expect(result.isRight())
    if (result.isRight()) {
      expect(result.value.orders).toHaveLength(10)
    }
  })
})
