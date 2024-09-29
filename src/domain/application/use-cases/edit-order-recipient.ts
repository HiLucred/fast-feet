import { Either, left, right } from '@/core/either'
import { OrdersRepository } from '../repositories/orders-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Order } from '@/domain/enterprise/entitys/order'
import { Address } from '@/domain/enterprise/value-objects/address'

interface EditOrderUseCaseRequest {
  orderId: string
  recipient: Partial<{
    name: string
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
    recipient,
  }: EditOrderUseCaseRequest): Promise<EditOrderUseCaseResponse> {
    const order = await this.ordersRepository.findById(orderId)

    if (!order) {
      return left(new ResourceNotFoundError())
    }

    const updatedRecipientName = recipient.name ?? order.recipient.name

    const {
      recipient: { address: previousAddress },
    } = order

    const updatedRecipientAddress = new Address({
      zipCode: recipient.zipCode ?? previousAddress.zipCode,
      city: recipient.city ?? previousAddress.city,
      neighborhood: recipient.neighborhood ?? previousAddress.neighborhood,
      street: recipient.street ?? previousAddress.street,
      number: recipient.number ?? previousAddress.number,
      state: recipient.state ?? previousAddress.state,
    })

    order.recipient.name = updatedRecipientName
    order.recipient.address = updatedRecipientAddress

    await this.ordersRepository.save(order)

    return right({ order })
  }
}
