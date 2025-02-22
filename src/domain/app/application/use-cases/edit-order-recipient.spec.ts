import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { EditOrderUseCase } from './edit-order-recipient'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { makeOrder } from 'test/factories/make-order'

describe('Edit Order Recipient Use Case', () => {
  let inMemoryRecipientsRepository: InMemoryRecipientsRepository
  let inMemoryOrdersRepository: InMemoryOrdersRepository
  let sut: EditOrderUseCase

  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )
    sut = new EditOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to edit a order', async () => {
    const order = makeOrder()
    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString(),
      recipient: { name: 'John Doe', city: 'Rio Branco' },
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryRecipientsRepository.recipients[0].name).toEqual('John Doe')
    if (result.isRight()) {
      expect(inMemoryRecipientsRepository.recipients[0]).toEqual(
        result.value.order.recipient,
      )
    }
  })
})
