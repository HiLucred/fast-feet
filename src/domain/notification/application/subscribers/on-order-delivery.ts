import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { OrderDeliveredEvent } from '@/domain/enterprise/events/order-delivered-event'
import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnOrderDelivery implements EventHandler {
  constructor(
    private readonly sendNotificationUseCase: SendNotificationUseCase,
  ) {}

  setupSubscriptions(): void {
    DomainEvents.register(
      this.sendOrderDeliveredNotification.bind(this),
      OrderDeliveredEvent.name,
    )
  }

  private async sendOrderDeliveredNotification({ order }: OrderDeliveredEvent) {
    await this.sendNotificationUseCase.execute({
      recipientNumber: order.recipient.phoneNumber,
      content: `Seu pedido foi entregue no endereço "${order.recipient.address.toString.toString().substring(0, 40).concat('...')}". Muito obrigado pela confiança, ${order.recipient.name}!!`,
    })
  }
}
