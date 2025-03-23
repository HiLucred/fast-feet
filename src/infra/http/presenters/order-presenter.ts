import { Order } from '@/domain/app/enterprise/entities/order'

export class OrderPresenter {
  static toHttp(order: Order) {
    return {
      created_at: order.createdAt,
      updated_at: order.updatedAt,
    }
  }
}
