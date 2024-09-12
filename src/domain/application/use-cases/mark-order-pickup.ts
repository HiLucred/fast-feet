import { Either, left, right } from '@/core/either'
import { OrdersRepository } from '../repositories/orders-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { CouriersRepository } from '../repositories/couriers-repository'
import { Order } from '@/domain/enterprise/entitys/order'

interface MarkOrderPickupUseCaseRequest {
  orderId: string
  courierId: string
}

type MarkOrderPickupUseCaseResponse = Either<
  ResourceNotFoundError,
  { order: Order }
>

export class MarkOrderPickupUseCase {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly couriersRepository: CouriersRepository,
  ) {}

  async execute({
    orderId,
    courierId,
  }: MarkOrderPickupUseCaseRequest): Promise<MarkOrderPickupUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    order.courierId = courier.id
    order.state = 'PickedUp'

    await this.ordersRepository.save(order)

    return right({ order })
  }
}
