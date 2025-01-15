import { Either, left, right } from '@/core/either'
import { OrdersRepository } from '../repositories/orders-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { CouriersRepository } from '../repositories/couriers-repository'
import { Order } from '@/domain/app/enterprise/entities/order'

interface MarkOrderPendingUseCaseRequest {
  orderId: string
  courierId: string
}

type MarkOrderPendingUseCaseResponse = Either<
  ResourceNotFoundError,
  { order: Order }
>

export class MarkOrderPendingUseCase {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly couriersRepository: CouriersRepository,
  ) {}

  async execute({
    orderId,
    courierId,
  }: MarkOrderPendingUseCaseRequest): Promise<MarkOrderPendingUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    order.markAsPending()
    order.courierId = courier.id

    await this.ordersRepository.save(order)

    return right({ order })
  }
}
