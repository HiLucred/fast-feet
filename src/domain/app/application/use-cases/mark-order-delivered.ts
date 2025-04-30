import { Either, left, right } from '@/core/either'
import { OrdersRepository } from '../repositories/orders-repository'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Order } from '@/domain/app/enterprise/entities/order'
import { DeliveryPhotosRepository } from '../repositories/delivery-photos-repository'
import { Injectable } from '@nestjs/common'
import { DeliveryPhotoNotFoundError } from './errors/delivery-photo-not-found-error'

interface MarkOrderDeliveredUseCaseRequest {
  orderId: string
  courierId: string
}

type MarkOrderDeliveredUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { order: Order }
>

@Injectable()
export class MarkOrderDeliveredUseCase {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly deliveryPhotosRepository: DeliveryPhotosRepository,
  ) { }

  async execute({
    orderId,
    courierId,
  }: MarkOrderDeliveredUseCaseRequest): Promise<MarkOrderDeliveredUseCaseResponse> {
    const deliveryPhoto =
      await this.deliveryPhotosRepository.findByOrderId(orderId)

    if (!deliveryPhoto) {
      return left(new DeliveryPhotoNotFoundError())
    }

    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    if (order.courierId?.toString() !== courierId) {
      return left(new NotAllowedError())
    }

    order.markAsDelivered()

    await this.ordersRepository.save(order)

    return right({ order })
  }
}
