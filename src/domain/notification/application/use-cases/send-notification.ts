import { Either, right } from '@/core/either'
import { NotificationsRepository } from '../repositories/notifications-repository'
import { Notification } from '../../enterprise/entities/notification'
import { SenderNotification } from '../sender/sender-notification'

interface SendNotificationUseCaseRequest {
  recipientNumber: string
  content: string
}

type SendNotificationUseCaseResponse = Either<
  null,
  { notification: Notification }
>

export class SendNotificationUseCase {
  constructor(
    private readonly notificationRepository: NotificationsRepository,
    private readonly senderNotification: SenderNotification,
  ) {}

  async execute({
    recipientNumber,
    content,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientNumber,
      content,
    })

    await this.notificationRepository.create(notification)

    await this.senderNotification.send({
      recipientNumber,
      message: content,
    })

    return right({ notification })
  }
}
