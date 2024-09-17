import { Order } from '@/domain/enterprise/entitys/order'

export abstract class OrdersRepository {
  abstract create(order: Order): Promise<void>
  abstract delete(order: Order): Promise<void>
  abstract save(order: Order): Promise<void>
  abstract findById(orderId: string): Promise<Order | null>
  abstract fetchByNeighborhood(neighborhood: string): Promise<Order[] | null>
  abstract fetchByCourierId(courierId: string): Promise<Order[] | null>
}
