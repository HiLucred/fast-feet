import { FakeSenderNotification } from 'test/notification/fake-sender-notification'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { OnOrderDelivery } from './on-order-delivery'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { waitFor } from 'test/utils/wait-for-it'
import { MockInstance } from 'vitest'

describe('On Order Delivery', () => {
  let inMemoryRecipientsRepository: InMemoryRecipientsRepository
  let inMemoryOrdersRepository: InMemoryOrdersRepository

  let inMemoryNotificationsRepository: InMemoryNotificationsRepository
  let fakeSenderNotification: FakeSenderNotification
  let sendNotificationUseCase: SendNotificationUseCase

  let sendNotificationExecuteSpy: MockInstance

  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    fakeSenderNotification = new FakeSenderNotification()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
      fakeSenderNotification,
    )

    new OnOrderDelivery(sendNotificationUseCase) // Antes de começar o código, um Listener fica "ouvindo" o evento

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')
  })

  it('should be able to subscribe on order delivery event', async () => {
    const order = makeOrder({ state: 'PickedUp' })
    inMemoryOrdersRepository.create(order)

    order.markAsDelivered() // Aqui eu marco que o evento foi acionado, porém não aciono ainda

    inMemoryOrdersRepository.save(order) // Aqui eu aciono o evento

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
      expect(inMemoryNotificationsRepository.notifications).toHaveLength(1)
    })
  })
})
