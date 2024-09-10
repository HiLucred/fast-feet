import { Order } from '@/domain/enterprise/entitys/order'
import { OrdersRepository } from '../repositories/orders-repository'
import { Either, right } from '@/core/either'
import { Recipient } from '@/domain/enterprise/entitys/recipient'
import { Address } from '@/domain/enterprise/value-objects/address'

interface CreateOrderUseCaseRequest {
  recipientName: string
  address: {
    zipCode: string
    street: string
    number: string
    state: string
    city: string
    neighborhood: string
  }
}

type CreateOrderUseCaseResponse = Either<unknown, { order: Order }>

export class CreateOrderUseCase {
  constructor(private readonly ordersRepository: OrdersRepository) {}

  async execute({
    recipientName,
    address,
  }: CreateOrderUseCaseRequest): Promise<CreateOrderUseCaseResponse> {
    const recipient = Recipient.create({
      name: recipientName,
      address: new Address(address),
    })

    const order = Order.create({
      recipient,
    })

    await this.ordersRepository.create(order)

    return right({ order })
  }
}
