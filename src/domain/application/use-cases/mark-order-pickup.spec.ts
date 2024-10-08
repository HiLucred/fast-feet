import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { MarkOrderPickupUseCase } from './mark-order-pickup'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { makeOrder } from 'test/factories/make-order'
import { makeCourier } from 'test/factories/make-courier'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryCouriersRepository: InMemoryCouriersRepository
let sut: MarkOrderPickupUseCase

describe('Mark Order Pickup Use Case', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    sut = new MarkOrderPickupUseCase(inMemoryOrdersRepository)
  })

  it('should be able to mark a order as pickup', async () => {
    const courier = makeCourier()
    await inMemoryCouriersRepository.create(courier)

    const order = makeOrder({ state: 'Pending', courierId: courier.id })
    await inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString,
      courierId: courier.id.toString,
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryOrdersRepository.orders[0].state).toEqual('PickedUp')
    }
  })

  it('should be able to save pickup date', async () => {
    const courier = makeCourier()
    await inMemoryCouriersRepository.create(courier)

    const order = makeOrder({ state: 'Pending', courierId: courier.id })
    await inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString,
      courierId: courier.id.toString,
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryOrdersRepository.orders[0].pickupDate).toEqual(
        expect.any(Date),
      )
    }
  })
})
