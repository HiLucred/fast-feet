import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order, OrderProps } from '@/domain/app/enterprise/entities/order'
import { Recipient } from '@/domain/app/enterprise/entities/recipient'
import { Address } from '@/domain/app/enterprise/entities/value-objects/address'
import { PrismaOrderMapper } from '@/infra/database/prisma/mappers/prisma-order-mapper'
import { PrismaRecipientMapper } from '@/infra/database/prisma/mappers/prisma-recipient-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { Order as PrismaOrder } from '@prisma/client'

export const makeOrder = (
  props: Partial<OrderProps> = {},
  id?: UniqueEntityId,
) => {
  const recipient = Recipient.create({
    name: faker.person.firstName(),
    phoneNumber: faker.phone.number(),
    address: new Address({
      zipCode: faker.location.zipCode(),
      street: faker.location.street(),
      neighborhood: faker.location.secondaryAddress(),
      city: faker.location.city(),
      number: faker.location.buildingNumber(),
      state: faker.location.state(),
    }),
  })

  return Order.create({ recipient, ...props }, id)
}

@Injectable()
export class OrderFactory {
  constructor(private readonly prisma: PrismaService) { }

  async makePrismaOrder(
    props: Partial<OrderProps> = {},
    id?: UniqueEntityId,
  ): Promise<PrismaOrder> {
    const order = makeOrder(props, id)

    await this.prisma.recipient.create({
      data: PrismaRecipientMapper.toPrisma(order.recipient),
    })

    const prismaOrder = await this.prisma.order.create({
      data: PrismaOrderMapper.toPrisma(order),
    })

    return prismaOrder
  }
}
