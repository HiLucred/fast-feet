import { Either, left, right } from '@/core/either'
import { OrdersRepository } from '../repositories/orders-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Order } from '@/domain/enterprise/entitys/order'
import { Recipient } from '@/domain/enterprise/entitys/recipient'
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

    const newRecipient = Recipient.create({
      name: recipient.name ?? order.recipient.name,
      address: new Address({
        zipCode: recipient.zipCode ?? order.recipient.address.zipCode,
        city: recipient.city ?? order.recipient.address.city,
        neighborhood:
          recipient.neighborhood ?? order.recipient.address.neighborhood,
        street: recipient.street ?? order.recipient.address.street,
        number: recipient.number ?? order.recipient.address.number,
        state: recipient.state ?? order.recipient.address.state,
      }),
    })

    order.recipient = newRecipient

    await this.ordersRepository.save(order)

    return right({ order })
  }
}
