import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { OrdersRepository } from '../repositories/orders-repository'
import { Order } from '@/domain/app/enterprise/entities/order'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface GetOrderByIdUseCaseRequest {
  orderId: string
  courierId: string
}

type GetOrderByIdUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { order: Order }
>

@Injectable()
export class GetOrderByIdUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
    courierId,
  }: GetOrderByIdUseCaseRequest): Promise<GetOrderByIdUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    if (order.courierId?.toString() !== courierId) {
      return left(new NotAllowedError())
    }

    return right({ order })
  }
}
