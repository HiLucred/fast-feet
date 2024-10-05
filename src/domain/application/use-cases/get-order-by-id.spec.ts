import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { GetOrderByIdUseCase } from './get-order-by-id'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { makeOrder } from 'test/factories/make-order'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: GetOrderByIdUseCase

describe('Get Order By Id Use Case', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )
    sut = new GetOrderByIdUseCase(inMemoryOrdersRepository)
  })

  it('should be able to get order by id', async () => {
    const order = makeOrder()
    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({ orderId: order.id.toString })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(result.value.order).toEqual(order)
    }
  })
})
