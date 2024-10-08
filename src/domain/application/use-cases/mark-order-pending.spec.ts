import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { MarkOrderPendingUseCase } from './mark-order-pending'
import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { makeCourier } from 'test/factories/make-courier'

let inMemoryCouriersRepository: InMemoryCouriersRepository
let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: MarkOrderPendingUseCase

describe('Mark Order Pending Use case', () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )
    sut = new MarkOrderPendingUseCase(
      inMemoryOrdersRepository,
      inMemoryCouriersRepository,
    )
  })

  it('should be able to mark a order as pending', async () => {
    const order = makeOrder()
    inMemoryOrdersRepository.create(order)

    const courier = makeCourier()
    inMemoryCouriersRepository.create(courier)

    const result = await sut.execute({
      userRole: 'admin',
      orderId: order.id.toString,
      courierId: courier.id.toString,
    })

    expect(result.isRight())
    expect(inMemoryOrdersRepository.orders[0].state).toEqual('Pending')
  })

  it('should be able to mark a order as pending without admin role', async () => {
    const order = makeOrder()
    inMemoryOrdersRepository.create(order)

    const courier = makeCourier()
    inMemoryCouriersRepository.create(courier)

    const result = await sut.execute({
      userRole: 'courier',
      orderId: order.id.toString,
      courierId: courier.id.toString,
    })

    expect(result.isLeft())
  })

  it('should be able to set a recipient id in an order', async () => {
    const order = makeOrder()
    inMemoryOrdersRepository.create(order)

    const courier = makeCourier()
    inMemoryCouriersRepository.create(courier)

    const result = await sut.execute({
      userRole: 'admin',
      orderId: order.id.toString,
      courierId: courier.id.toString,
    })

    expect(result.isRight())
    expect(inMemoryOrdersRepository.orders[0].courierId).toEqual(courier.id)
  })
})
