import { Either, left, right } from '@/core/either'
import { OrdersRepository } from '../repositories/orders-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Order } from '@/domain/app/enterprise/entities/order'
import { Address } from '@/domain/app/enterprise/entities/value-objects/address'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface EditOrderUseCaseRequest {
  orderId: string
  courierId?: string
  state?: string
  recipient: Partial<{
    name: string
    phoneNumber: string
    zipCode: string
    street: string
    number: string
    neighborhood: string
    state: string
    city: string
  }>
}

type EditOrderUseCaseResponse = Either<ResourceNotFoundError, { order: Order }>

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
      zipCode: recipient.zipCode ?? previousAddress.zipCode,
      city: recipient.city ?? previousAddress.city,
      neighborhood: recipient.neighborhood ?? previousAddress.neighborhood,
      street: recipient.street ?? previousAddress.street,
      number: recipient.number ?? previousAddress.number,
      state: recipient.state ?? previousAddress.state,
    })

    const updatedRecipientName = recipient.name ?? order.recipient.name
    const updatedrecipientPhoneNumber =
      recipient.phoneNumber ?? order.recipient.phoneNumber

    order.recipient.name = updatedRecipientName
    order.recipient.phoneNumber = updatedrecipientPhoneNumber
    order.recipient.address = updatedRecipientAddress
    order.courierId = courierId
      ? new UniqueEntityId(courierId)
      : order.courierId

    await this.ordersRepository.save(order)

    return right({ order })
  }
}
