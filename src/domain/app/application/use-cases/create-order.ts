import { OrdersRepository } from '../repositories/orders-repository'
import { Either, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { Order } from '@/domain/app/enterprise/entities/order'
import { Recipient } from '@/domain/app/enterprise/entities/recipient'
import { Address } from '@/domain/app/enterprise/entities/value-objects/address'

interface CreateOrderUseCaseRequest {
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
    recipientName,
    recipientPhoneNumber,
    address,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
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
