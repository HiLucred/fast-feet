import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { MarkOrderPendingUseCase } from './mark-order-pending'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: MarkOrderPendingUseCase

describe('Mark Order Pending Use case', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )
    sut = new MarkOrderPendingUseCase(inMemoryOrdersRepository)
  })

  it('should be able to set order to pending"', async () => {
    const order = makeOrder()
    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString,
    })

    expect(result.isRight())
    expect(inMemoryOrdersRepository.orders[0].state).toEqual('Pending')
  })
})
