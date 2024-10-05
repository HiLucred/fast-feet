import { Either, right } from '@/core/either'
import { Order } from '@/domain/enterprise/entities/order'
import { OrdersRepository } from '../repositories/orders-repository'

interface FetchDeliveredOrdersByCourierUseCaseRequest {
  courierId: string
}

type FetchDeliveredOrdersByCourierUseCaseReponse = Either<
  null,
  { orders: Order[] }
>

export class FetchDeliveredOrdersByCourierUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async execute({
    courierId,
  }: FetchDeliveredOrdersByCourierUseCaseRequest): Promise<FetchDeliveredOrdersByCourierUseCaseReponse> {
    const orders = await this.ordersRepository.findManyByCourierId(courierId)

    const deliveredOrders = orders.filter(
      (order) => order.state === 'Delivered',
    )

    return right({ orders: deliveredOrders })
  }
}
