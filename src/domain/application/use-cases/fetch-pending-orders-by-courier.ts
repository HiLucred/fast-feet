import { Either, right } from '@/core/either'
import { Order } from '@/domain/enterprise/entitys/order'
import { OrdersRepository } from '../repositories/orders-repository'

interface FetchPendingOrdersByCourierUseCaseRequest {
  courierId: string
}

type FetchPendingOrdersByCourierUseCaseResponse = Either<
  null,
  { orders: Order[] }
>

export class FetchPendingOrdersByCourierUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async execute({
    courierId,
  }: FetchPendingOrdersByCourierUseCaseRequest): Promise<FetchPendingOrdersByCourierUseCaseResponse> {
    const orders = await this.ordersRepository.findManyByCourierId(courierId)

    const pendingOrders = orders.filter(
      (order) => order.state === 'Pending' || order.state === 'PickedUp',
    )

    return right({ orders: pendingOrders })
  }
}
