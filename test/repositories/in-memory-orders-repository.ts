import { OrdersRepository } from 'src/domain/application/repositories/orders-repository'
import { Order } from 'src/domain/enterprise/entitys/order'
import { InMemoryRecipientsRepository } from './in-memory-recipients-repository'

export class InMemoryOrdersRepository implements OrdersRepository {
  public orders: Order[] = []

  constructor(
    private readonly inMemoryRecipientsRepository: InMemoryRecipientsRepository,
  ) {}

  async create(order: Order): Promise<void> {
    this.orders.push(order)
    this.inMemoryRecipientsRepository.create(order.recipient)
  }

  async delete(order: Order): Promise<void> {
    const index = this.orders.findIndex((item) => item.id === order.id)
    this.orders.splice(index)

    this.inMemoryRecipientsRepository.delete(order.recipient)
  }

  async save(order: Order): Promise<void> {
    const orderIndex = this.orders.findIndex(
      (item) => item.id.toString === order.id.toString,
    )
    this.orders[orderIndex] = order

    this.inMemoryRecipientsRepository.save(order.recipient)
  }

  async findById(orderId: string): Promise<Order | null> {
    const order = this.orders.find((item) => item.id.toString === orderId)

    if (!order) return null

    return order
  }

  async findManyByNeighborhood(neighborhood: string): Promise<Order[]> {
    const orders = this.orders.filter(
      (item) => item.recipient.address.neighborhood === neighborhood,
    )

    return orders
  }

  async findManyByCourierId(courierId: string): Promise<Order[]> {
    const orders = this.orders.filter(
      (item) => item.courierId?.toString === courierId,
    )

    return orders
  }
}
