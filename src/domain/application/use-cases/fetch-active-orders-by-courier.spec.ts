import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { FetchActiveOrdersByCourierUseCase } from './fetch-active-orders-by-courier'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: FetchActiveOrdersByCourierUseCase

describe('Fetch Active Orders By Courier Use Case', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )
    sut = new FetchActiveOrdersByCourierUseCase(inMemoryOrdersRepository)
  })

  it('should be able to fetch pending orders by courier', async () => {
    const FAKE_COURIER_ID = 'fake-courier-id'

    // Create 10 Orders by courier
    for (let i = 1; i <= 10; i++) {
      inMemoryOrdersRepository.create(
        makeOrder({
          courierId: new UniqueEntityId(FAKE_COURIER_ID),
          state: 'Pending', // "Active" or "Picked Up" === Active Order
        }),
      )
    }

    const result = await sut.execute({ courierId: FAKE_COURIER_ID })

    expect(result.isRight())
    if (result.isRight()) {
      expect(result.value.orders).toHaveLength(10)
    }
  })
})
