import { Either, right } from '@/core/either'
import { Order } from '@/domain/enterprise/entitys/order'
import { OrdersRepository } from '../repositories/orders-repository'

interface FetchActiveOrdersByCourierUseCaseRequest {
  courierId: string
}

type FetchActiveOrdersByCourierUseCaseResponse = Either<
  null,
  { orders: Order[] }
>

export class FetchActiveOrdersByCourierUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async execute({
    courierId,
  }: FetchActiveOrdersByCourierUseCaseRequest): Promise<FetchActiveOrdersByCourierUseCaseResponse> {
    const orders = await this.ordersRepository.findManyByCourierId(courierId)

    const pendingOrders = orders.filter(
      (order) => order.state === 'Pending' || order.state === 'PickedUp',
    )

    return right({ orders: pendingOrders })
  }
}
