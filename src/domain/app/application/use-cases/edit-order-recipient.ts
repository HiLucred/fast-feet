import { Either, left, right } from '@/core/either'
import { OrdersRepository } from '../repositories/orders-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Order } from '@/domain/app/enterprise/entities/order'
import { Address } from '@/domain/app/enterprise/entities/value-objects/address'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'

interface EditOrderUseCaseRequest {
  orderId: string
  courierId?: string
  state?: string
  recipient?: {
    name?: string
    phoneNumber?: string
    address?: {
      zipCode?: string
      street?: string
      number?: string
      neighborhood?: string
      state?: string
      city?: string
    }
  }
}

type EditOrderUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { order: Order }
>

@Injectable()
export class EditOrderUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async execute({
    orderId,
    courierId,
    state,
    recipient,
  }: EditOrderUseCaseRequest): Promise<EditOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    if (order.state === 'Delivered' || order.state === 'PickedUp') {
      return left(new NotAllowedError())
    }

    const previousAddress = order.recipient.address

    const updatedRecipientAddress = new Address({
      zipCode: recipient?.address?.zipCode ?? previousAddress.zipCode,
      city: recipient?.address?.city ?? previousAddress.city,
      neighborhood:
        recipient?.address?.neighborhood ?? previousAddress.neighborhood,
      street: recipient?.address?.street ?? previousAddress.street,
      number: recipient?.address?.number ?? previousAddress.number,
      state: recipient?.address?.state ?? previousAddress.state,
    })

    order.recipient.name = recipient?.name ?? order.recipient.name

    order.recipient.phoneNumber =
      recipient?.phoneNumber ?? order.recipient.phoneNumber

    order.recipient.address = recipient?.address
      ? updatedRecipientAddress
      : order.recipient.address

    order.courierId = courierId
      ? new UniqueEntityId(courierId)
      : order.courierId

    await this.ordersRepository.save(order)

    return right({ order })
  }
}
