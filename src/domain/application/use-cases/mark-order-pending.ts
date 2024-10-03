import { Either, left, right } from '@/core/either'
import { OrdersRepository } from '../repositories/orders-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Order } from '@/domain/enterprise/entitys/order'
import { CouriersRepository } from '../repositories/couriers-repository'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

interface MarkOrderPendingUseCaseRequest {
  userRole: string
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
    userRole,
    orderId,
    courierId,
  }: MarkOrderPendingUseCaseRequest): Promise<MarkOrderPendingUseCaseResponse> {
    if (userRole !== 'admin') {
      return left(new NotAllowedError())
    }

    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    order.state = 'Pending'
    order.courierId = courier.id

    await this.ordersRepository.save(order)

    return right({ order })
  }
}
