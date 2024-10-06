import { Either, left, right } from '@/core/either'
import { OrdersRepository } from '../repositories/orders-repository'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Order } from '@/domain/enterprise/entities/order'
import { DeliveryPhotosRepository } from '../repositories/delivery-photos-repository'

interface MarkOrderDeliveredUseCaseRequest {
  orderId: string
  courierId: string
}

type MarkOrderDeliveredUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { order: Order }
>

export class MarkOrderDeliveredUseCase {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly deliveryPhotosRepository: DeliveryPhotosRepository,
  ) {}

  async execute({
    orderId,
    courierId,
  }: MarkOrderDeliveredUseCaseRequest): Promise<MarkOrderDeliveredUseCaseResponse> {
    const deliveryPhoto =
      await this.deliveryPhotosRepository.findByOrderId(orderId)

    if (!deliveryPhoto) {
      return left(new NotAllowedError())
    }

    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    if (order.courierId?.toString !== courierId) {
      return left(new NotAllowedError())
    }

    order.state = 'Delivered'

    await this.ordersRepository.save(order)

    return right({ order })
  }
}
