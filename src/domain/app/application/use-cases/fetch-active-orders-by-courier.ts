import { Either, right } from '@/core/either'
import { Order } from '@/domain/app/enterprise/entities/order'
import { OrdersRepository } from '../repositories/orders-repository'
import { Injectable } from '@nestjs/common'

interface FetchActiveOrdersByCourierUseCaseRequest {
  courierId: string
  page?: number
}

type FetchActiveOrdersByCourierUseCaseResponse = Either<
  null,
  { orders: Order[] }
>

@Injectable()
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
