import { Either, right } from '@/core/either'
import { OrdersRepository } from '../repositories/orders-repository'
import { Order } from '@/domain/app/enterprise/entities/order'
import { Injectable } from '@nestjs/common'

interface FetchOrdersByNeighborhoodUseCaseRequest {
  neighborhood: string
  courierId: string
}

type FetchOrdersByNeighborhoodUseCaseResponse = Either<
  null,
  { orders: Order[] }
>

@Injectable()
export class FetchOrdersByNeighborhoodUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async execute({
    neighborhood,
    courierId,
  }: FetchOrdersByNeighborhoodUseCaseRequest): Promise<FetchOrdersByNeighborhoodUseCaseResponse> {
    const ordersByCourier =
      await this.ordersRepository.findManyByCourierId(courierId)

    const orders = ordersByCourier.filter((order) => {
      return (
        order.recipient.address.neighborhood === neighborhood &&
        order.state === 'Pending'
      )
    })

    return right({ orders })
  }
}
