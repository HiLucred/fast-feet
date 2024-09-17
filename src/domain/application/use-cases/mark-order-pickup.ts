import { Either, left, right } from '@/core/either'
import { OrdersRepository } from '../repositories/orders-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Order } from '@/domain/enterprise/entitys/order'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

interface MarkOrderPickupUseCaseRequest {
  orderId: string
  courierId: string
}

type MarkOrderPickupUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { order: Order }
>

export class MarkOrderPickupUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
    courierId,
  }: MarkOrderPickupUseCaseRequest): Promise<MarkOrderPickupUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    if (!order.courierId) {
      return left(new ResourceNotFoundError())
    }

    if (order.courierId.toString !== courierId) {
      return left(new NotAllowedError())
    }

    order.state = 'PickedUp'

    await this.ordersRepository.save(order)

    return right({ order })
  }
}
