import { Order } from '@/domain/enterprise/entitys/order'

export abstract class OrdersRepository {
  abstract create(order: Order): Promise<void>
  abstract delete(order: Order): Promise<void>
  abstract save(order: Order): Promise<void>
  abstract findById(orderId: string): Promise<Order | null>
}
