import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { OrderDeliveredEvent } from '@/domain/enterprise/events/order-delivered-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnOrderDelivery implements EventHandler {
  constructor(
    private readonly sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOrderDeliveredNotification.bind(this),
      OrderDeliveredEvent.name,
    )
  }

  private async sendOrderDeliveredNotification({ order }: OrderDeliveredEvent) {
    await this.sendNotificationUseCase.execute({
      recipientNumber: order.recipient.phoneNumber,
      content: `✅ Olá, ${order.recipient.name}! Seu pedido foi entregue com sucesso em ${order.recipient.address.toString()}. Obrigado por confiar em nossos serviços!"`,
    })
  }
}
