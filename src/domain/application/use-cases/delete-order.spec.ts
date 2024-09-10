import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { DeleteOrderUseCase } from './delete-order'
import { Order } from '@/domain/enterprise/entitys/order'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

let inMemoryOrdersRepository: InMemoryOrdersRepository
let sout: DeleteOrderUseCase

describe('Delete Order Use case', () => {
  beforeEach(() => {
    inMemoryOrdersRepository = new InMemoryOrdersRepository()
    sout = new DeleteOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to delete a order', async () => {
    const order = Order.create({ recipientId: new UniqueEntityId() })
    inMemoryOrdersRepository.create(order)

    const result = await sout.execute({
      orderId: order.id.toString,
      recipientId: order.recipientId.toString,
    })

    expect(result.isRight())
    expect(inMemoryOrdersRepository.orders).toHaveLength(0)
  })

  it('should not be able to delete a order from other recipient', async () => {
    const order = Order.create({ recipientId: new UniqueEntityId() })
    inMemoryOrdersRepository.create(order)

    const result = await sout.execute({
      orderId: order.id.toString,
      recipientId: 'fake-other-recipient-id',
    })

    expect(result.isLeft())
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryOrdersRepository.orders).toHaveLength(1)
  })

  it('should not be able to delete a pickup order', async () => {
    const order = Order.create({
      recipientId: new UniqueEntityId(),
      courierId: new UniqueEntityId(),
    })
    inMemoryOrdersRepository.create(order)

    order.state = 'PickedUp'

    const result = await sout.execute({
      orderId: order.id.toString,
      recipientId: order.recipientId.toString,
    })

    expect(result.isLeft())
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryOrdersRepository.orders).toHaveLength(1)
  })
})
