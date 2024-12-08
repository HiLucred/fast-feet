import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/domain-handler'
import { OrderPendingEvent } from '@/domain/enterprise/events/order-pending-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnOrderPending implements EventHandler {
  constructor(
    private readonly sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOrderPendingNotification.bind(this),
      OrderPendingEvent.name,
    )
  }

  private async sendOrderPendingNotification({ order }: OrderPendingEvent) {
    await this.sendNotificationUseCase.execute({
      recipientNumber: order.recipient.phoneNumber,
      content: `📦✅ O Pedido chegou em "R. ${order.recipient.address.street}, ${order.recipient.address.number}". Muito obrigado pela confiança, ${order.recipient.name}!! 😄❤️`,
    })
  }
}
