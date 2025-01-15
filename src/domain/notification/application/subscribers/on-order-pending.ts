import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/domain-handler'
import { OrderPendingEvent } from '@/domain/app/enterprise/events/order-pending-event'
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
      content: `📦 Olá, ${order.recipient.name}! Seu pedido com entrega para ${order.recipient.address.toString()} está pendente. Estamos cuidando de tudo para você!`,
    })
  }
}
