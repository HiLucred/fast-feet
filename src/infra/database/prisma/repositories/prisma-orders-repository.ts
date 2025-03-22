import { OrdersRepository } from '@/domain/app/application/repositories/orders-repository'
import { Order } from '@/domain/app/enterprise/entities/order'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'
import { PrismaOrderMapper } from '../mappers/prisma-order-mapper'
import { PrismaRecipientMapper } from '../mappers/prisma-recipient-mapper'

@Injectable()
export class PrismaOrdersRepository implements OrdersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(order: Order): Promise<void> {
    await this.prisma.recipient.create({
      data: PrismaRecipientMapper.toPrisma(order.recipient),
    })
    await this.prisma.order.create({ data: PrismaOrderMapper.toPrisma(order) })
  }

  async delete(order: Order): Promise<void> {
    await this.prisma.order.delete({ where: { id: order.id.toString() } })
  }

  async findById(orderId: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        recipient: true,
      },
    })

    if (!order) return null

    return PrismaOrderMapper.toDomain(order)
  }

  async findManyByCourierId(courierId: string): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        courierId,
      },
      include: {
        recipient: true,
      },
    })

    return orders.map((order) => PrismaOrderMapper.toDomain(order))
  }

  async findManyByNeighborhood(neighborhood: string): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({
      where: {
        recipient: {
          neighborhood,
        },
      },
      include: {
        recipient: true,
      },
    })

    return orders.map((order) => PrismaOrderMapper.toDomain(order))
  }

  async save(order: Order): Promise<void> {
    await this.prisma.order.update({
      where: {
        id: order.id.toString(),
      },
      data: PrismaOrderMapper.toPrisma(order),
    })
  }
}
