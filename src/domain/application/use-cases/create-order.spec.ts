import { CreateOrderUseCase } from './create-order'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let sout: CreateOrderUseCase

describe('Create Order Use Case', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    sout = new CreateOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to create a order', async () => {
    const result = await sout.execute({
      recipientId: 'fake-recipient-id',
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryOrdersRepository.orders).toHaveLength(1)

    if (result.isRight()) {
      expect(inMemoryOrdersRepository.orders[0]).toEqual(result.value.order)
    }
  })
})
