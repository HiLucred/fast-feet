import { Either, left, right } from '@/core/either'
import { OrdersRepository } from '../repositories/orders-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { Order } from '@/domain/enterprise/entitys/order'

interface FetchOrdersByNeighborhoodUseCaseRequest {
  neighborhood: string
  courierId: string
}

type FetchOrdersByNeighborhoodUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { orders: Order[] }
>

export class FetchOrdersByNeighborhoodUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async execute({
    neighborhood,
    courierId,
  }: FetchOrdersByNeighborhoodUseCaseRequest): Promise<FetchOrdersByNeighborhoodUseCaseResponse> {
    const ordersByCourier =
      await this.ordersRepository.fetchByCourierId(courierId)

    if (!ordersByCourier) {
      return left(new ResourceNotFoundError())
    }

    const orders = ordersByCourier.filter(
      (order) =>
        order.recipient.address.neighborhood === neighborhood &&
        order.state !== 'Delivered',
    )

    return right({ orders })
  }
}
