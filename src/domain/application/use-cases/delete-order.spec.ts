import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { DeleteOrderUseCase } from './delete-order'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: DeleteOrderUseCase

describe('Delete Order Use case', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )
    sut = new DeleteOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to delete a order', async () => {
    const order = makeOrder()
    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      userRole: 'admin',
      orderId: order.id.toString,
    })

    expect(result.isRight())
    expect(inMemoryOrdersRepository.orders).toHaveLength(0)
  })

  it('should not be able to delete a order without admin role', async () => {
    const order = makeOrder()
    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      userRole: 'courier',
      orderId: order.id.toString,
    })

    expect(result.isLeft())
    expect(inMemoryOrdersRepository.orders).toHaveLength(1)
  })

  it('should be able to delete a recipient on database', async () => {
    const order = makeOrder()
    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      userRole: 'admin',
      orderId: order.id.toString,
    })

    expect(result.isRight())
    expect(inMemoryRecipientsRepository.recipients).toHaveLength(0)
  })

  it('should not be able to delete a pickup order', async () => {
    const order = makeOrder({ state: 'Pending' }) // Create a order with "Pending" state
    inMemoryOrdersRepository.create(order)

    order.state = 'PickedUp' // Courier pickup order

    const result = await sut.execute({
      userRole: 'admin',
      orderId: order.id.toString,
    })

    expect(result.isLeft())
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryOrdersRepository.orders).toHaveLength(1)
  })
})
