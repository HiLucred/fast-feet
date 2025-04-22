import { Order } from '@/domain/app/enterprise/entities/order'

export class OrderPresenter {
  static toHttp(order: Order) {
    return {
      recipient_name: order.recipient.name,
      address: {
        zip_code: order.recipient.address.zipCode,
        street: order.recipient.address.street,
        state: order.recipient.address.state,
        number: order.recipient.address.number,
        neighborhood: order.recipient.address.neighborhood,
        city: order.recipient.address.city,
      },
      state: order.state,
      pickup_date: order.pickupDate,
      delivery_data: order.deliveryDate,
      created_at: order.createdAt,
      updated_at: order.updatedAt,
    }
  }
}
