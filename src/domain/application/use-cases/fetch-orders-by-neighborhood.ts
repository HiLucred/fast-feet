import { Either, right } from '@/core/either'
import { OrdersRepository } from '../repositories/orders-repository'
import { Order } from '@/domain/enterprise/entitys/order'

interface FetchOrdersByNeighborhoodUseCaseRequest {
  neighborhood: string
  courierId: string
}

type FetchOrdersByNeighborhoodUseCaseResponse = Either<
  unknown,
  { orders: Order[] }
>

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
        order.state !== 'Delivered'
      )
    })

    return right({ orders })
  }
}
