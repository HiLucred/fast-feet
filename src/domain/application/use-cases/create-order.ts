import { OrdersRepository } from '../repositories/orders-repository'
import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { Order } from '@/domain/enterprise/entities/order'
import { Recipient } from '@/domain/enterprise/entities/recipient'
import { Address } from '@/domain/enterprise/entities/value-objects/address'

interface CreateOrderUseCaseRequest {
  userRole: string
  recipientName: string
  recipientPhoneNumber: string
  address: {
    zipCode: string
    street: string
    number: string
    state: string
    city: string
    neighborhood: string
  }
}

type CreateOrderUseCaseResponse = Either<NotAllowedError, { order: Order }>

export class CreateOrderUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async execute({
    userRole,
    recipientName,
    recipientPhoneNumber,
    address,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    if (userRole !== 'admin') {
      return left(new NotAllowedError())
    }

    const recipient = Recipient.create({
      name: recipientName,
      phoneNumber: recipientPhoneNumber,
      address: new Address(address),
    })

    const order = Order.create({
      recipient,
    })

    await this.ordersRepository.create(order)

    return right({ order })
  }
}
