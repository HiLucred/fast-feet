import { Order } from '@/domain/app/enterprise/entities/order'

export class OrdersPresenter {
  static toHttp(order: Order) {
    return {
      created_at: order.createdAt,
      updated_at: order.updatedAt,
    }
  }
}
