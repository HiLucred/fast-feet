import { InMemoryDeliveryPhotosRepository } from 'test/repositories/in-memory-delivery-photos-repository'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { MarkOrderDeliveredUseCase } from './mark-order-delivered'
import { DeliveryPhoto } from '@/domain/enterprise/entities/delivery-photo'
import { makeOrder } from 'test/factories/make-order'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { faker } from '@faker-js/faker'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let inMemoryDeliveryPhotosRepository: InMemoryDeliveryPhotosRepository
let sut: MarkOrderDeliveredUseCase

describe('Mark Order Delivered Use Case', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )
    inMemoryDeliveryPhotosRepository = new InMemoryDeliveryPhotosRepository()
    sut = new MarkOrderDeliveredUseCase(
      inMemoryOrdersRepository,
      inMemoryDeliveryPhotosRepository,
    )
  })

  it('should be able to mark order as delivered', async () => {
    const FAKE_COURIER_ID = 'fake-courier-id'

    const order = makeOrder({
      courierId: new UniqueEntityId(FAKE_COURIER_ID),
      state: 'PickedUp',
    })
    inMemoryOrdersRepository.create(order)

    inMemoryDeliveryPhotosRepository.create(
      DeliveryPhoto.create({
        orderId: order.id.toString,
        title: faker.string.alpha(),
        url: faker.internet.url(),
      }),
    )

    const result = await sut.execute({
      courierId: FAKE_COURIER_ID,
      orderId: order.id.toString,
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryOrdersRepository.orders[0].state).toEqual('Delivered')
    if (result.isRight()) {
      expect(result.value.order.state).toEqual('Delivered')
    }
  })

  it('should not be able to mark order as delivered without delivery photo', async () => {
    const FAKE_COURIER_ID = 'fake-courier-id'

    const order = makeOrder({
      courierId: new UniqueEntityId(FAKE_COURIER_ID),
      state: 'PickedUp',
    })
    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      courierId: FAKE_COURIER_ID,
      orderId: order.id.toString,
    })

    expect(result.isLeft()).toBeTruthy()
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(NotAllowedError)
    }
  })

  it('should not be able to mark order as delivered from other courier', async () => {
    const FAKE_COURIER_ID = 'fake-courier-id'
    const FAKE_COURIER_ID_2 = 'fake-courier-id-2'

    const order = makeOrder({
      courierId: new UniqueEntityId(FAKE_COURIER_ID),
      state: 'PickedUp',
    })
    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      courierId: FAKE_COURIER_ID_2,
      orderId: order.id.toString,
    })

    expect(result.isLeft()).toBeTruthy()
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(NotAllowedError)
    }
  })
})
