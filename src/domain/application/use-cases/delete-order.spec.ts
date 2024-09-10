import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { DeleteOrderUseCase } from './delete-order'
import { Order } from '@/domain/enterprise/entitys/order'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sout: DeleteOrderUseCase

describe('Delete Order Use case', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )
    sout = new DeleteOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to delete a order', async () => {
    const order = makeOrder()
    inMemoryOrdersRepository.create(order)

    const result = await sout.execute({
      orderId: order.id.toString,
    })

    expect(result.isRight())
    expect(inMemoryOrdersRepository.orders).toHaveLength(0)
  })

  it('should be able to delete a recipient on database', async () => {
    const order = makeOrder()
    inMemoryOrdersRepository.create(order)

    const result = await sout.execute({
      orderId: order.id.toString,
    })

    expect(result.isRight())
    expect(inMemoryRecipientsRepository.recipients).toHaveLength(0)
  })

  it('should not be able to delete a pickup order', async () => {
    const order = makeOrder()
    inMemoryOrdersRepository.create(order)

    order.state = 'PickedUp'

    const result = await sout.execute({
      orderId: order.id.toString,
    })

    expect(result.isLeft())
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryOrdersRepository.orders).toHaveLength(1)
  })
})
