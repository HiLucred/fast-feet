import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/domain-handler'
import { OrderPickedUpEvent } from '@/domain/enterprise/events/order-picked-up-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnOrderPickedUp implements EventHandler {
  constructor(
    private readonly sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOrderPickedUpNotification.bind(this),
      OrderPickedUpEvent.name,
    )
  }

  private async sendOrderPickedUpNotification({ order }: OrderPickedUpEvent) {
    await this.sendNotificationUseCase.execute({
      recipientNumber: order.recipient.phoneNumber,
      content: `📦✅ O Pedido chegou em "R. ${order.recipient.address.street}, ${order.recipient.address.number}". Muito obrigado pela confiança, ${order.recipient.name}!! 😄❤️`,
    })
  }
}
