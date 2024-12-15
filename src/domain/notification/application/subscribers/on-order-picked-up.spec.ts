import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { OnOrderPickedUp } from './on-order-picked-up'
import { FakeSenderNotification } from 'test/notification/fake-sender-notification'
import { makeOrder } from 'test/factories/make-order'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { waitFor } from 'test/utils/wait-for-it'
import { MockInstance } from 'vitest'

describe('On Order Picked Up', () => {
  let fakeSenderNotification: FakeSenderNotification
  let inMemoryNotificationsRepository: InMemoryNotificationsRepository
  let sendNotificationUseCase: SendNotificationUseCase
  let inMemoryRecipientsRepository: InMemoryRecipientsRepository
  let inMemoryOrdersRepository: InMemoryOrdersRepository

  let sendNotificationExecuteSpy: MockInstance

  beforeEach(() => {
    fakeSenderNotification = new FakeSenderNotification()
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
      fakeSenderNotification,
    )
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )

    new OnOrderPickedUp(sendNotificationUseCase)
    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')
  })

  it('should be able to subscribe on order picked up event', async () => {
    const order = makeOrder()
    inMemoryOrdersRepository.create(order)

    // 1 - Marco o pedido como pendente
    order.markAsPending()
    inMemoryOrdersRepository.save(order)

    // 2 - Marco o pedido como retirado
    order.markAsPickedUp()
    inMemoryOrdersRepository.save(order)

    await waitFor(() => {
      expect(sendNotificationExecuteSpy).toHaveBeenCalled()
      expect(inMemoryNotificationsRepository.notifications).toHaveLength(1)
    })
  })
})
