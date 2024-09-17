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
    const fakeCourierId = new UniqueEntityId('fake-courier-id')

    const order = makeOrder({
      courierId: fakeCourierId,
    })

    for (let i = 0; i < 10; i++) {
      inMemoryOrdersRepository.create(order)
    }

    const result = await sut.execute({
      neighborhood: order.recipient.address.neighborhood,
      courierId: fakeCourierId.toString,
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(result.value.orders).toHaveLength(10)
    }
  })
})
