import { Either, left, right } from '@/core/either'
import { OrdersRepository } from '../repositories/orders-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Order } from '@/domain/enterprise/entitys/order'
import { Address } from '@/domain/enterprise/value-objects/address'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

interface EditOrderUseCaseRequest {
  userRole: string
  orderId: string
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
    userRole,
    orderId,
    recipient,
  }: EditOrderUseCaseRequest): Promise<EditOrderUseCaseResponse> {
    if (userRole !== 'admin') {
      return left(new NotAllowedError())
    }

    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
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

    await this.ordersRepository.save(order)

    return right({ order })
  }
}
