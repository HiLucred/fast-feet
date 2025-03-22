import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { GetOrderByIdUseCase } from './get-order-by-id'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

describe('Get Order By Id Use Case', () => {
  let inMemoryRecipientsRepository: InMemoryRecipientsRepository
  let inMemoryOrdersRepository: InMemoryOrdersRepository
  let sut: GetOrderByIdUseCase

  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )
    sut = new GetOrderByIdUseCase(inMemoryOrdersRepository)
  })

  it('should be able to get order by id', async () => {
    const order = makeOrder({ courierId: new UniqueEntityId('819839281') })
    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      courierId: '819839281',
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(result.value.order).toEqual(order)
    }
  })
})
