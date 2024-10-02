import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { EditOrderUseCase } from './edit-order-recipient'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { makeOrder } from 'test/factories/make-order'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: EditOrderUseCase

describe('Edit Order Recipient Use Case', () => {
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
      userRole: 'admin',
      orderId: order.id.toString,
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

  it('should not be able to edit a order without admin role', async () => {
    const order = makeOrder()
    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      userRole: 'courier',
      orderId: order.id.toString,
      recipient: { name: 'John Doe', city: 'Rio Branco' },
    })

    expect(result.isLeft()).toBeTruthy()
  })
})
