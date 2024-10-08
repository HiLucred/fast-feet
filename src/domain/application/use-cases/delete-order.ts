import { Either, left, right } from '@/core/either'
import { OrdersRepository } from '../repositories/orders-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

interface DeleteOrderUseCaseRequest {
  userRole: string
  orderId: string
}

type DeleteOrderUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  null
>

export class DeleteOrderUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async execute({
    userRole,
    orderId,
  }: DeleteOrderUseCaseRequest): Promise<DeleteOrderUseCaseResponse> {
    if (userRole !== 'admin') {
      return left(new NotAllowedError())
    }

    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    if (order.state === 'PickedUp') {
      return left(new NotAllowedError())
    }

    await this.ordersRepository.delete(order)

    return right(null)
  }
}
