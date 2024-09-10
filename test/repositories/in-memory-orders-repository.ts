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

    this.inMemoryRecipientsRepository.recipients.push(order.recipient)
  }

  async delete(order: Order): Promise<void> {
    const index = this.orders.findIndex((item) => item.id === order.id)
    this.orders.splice(index)
  }

  async findById(orderId: string): Promise<Order | null> {
    const order = this.orders.find((item) => item.id.toString === orderId)
    if (!order) return null
    return order
  }
}
