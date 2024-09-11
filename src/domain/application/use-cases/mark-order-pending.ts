import { Either, left, right } from '@/core/either'
import { OrdersRepository } from '../repositories/orders-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Order } from '@/domain/enterprise/entitys/order'

interface MarkOrderPendingUseCaseRequest {
  orderId: string
}

type MarkOrderPendingUseCaseResponse = Either<
  ResourceNotFoundError,
  { order: Order }
>

export class MarkOrderPendingUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
  }: MarkOrderPendingUseCaseRequest): Promise<MarkOrderPendingUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    order.state = 'Pending'

    return right({ order })
  }
}
