import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { SendNotificationUseCase } from './send-notification'
import { FakeSenderNotification } from 'test/notification/fake-sender-notification'
import { faker } from '@faker-js/faker'

describe('Send Notification Use Case', () => {
  let inMemoryNotificationsRepository: InMemoryNotificationsRepository
  let fakeSenderNotification: FakeSenderNotification
  let sut: SendNotificationUseCase

  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    fakeSenderNotification = new FakeSenderNotification()
    sut = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
      fakeSenderNotification,
    )
  })

  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      recipientNumber: faker.phone.number(),
      content: 'Notification sent successfully!',
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryNotificationsRepository.notifications).toHaveLength(1)
      expect(inMemoryNotificationsRepository.notifications[0]).toEqual(
        result.value.notification,
      )
    }
  })
})
