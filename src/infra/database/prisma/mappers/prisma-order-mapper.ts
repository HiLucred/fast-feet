import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { OrderState } from '@/core/types/order-state'
import { Order } from '@/domain/app/enterprise/entities/order'
import { PrismaRecipientMapper } from './prisma-recipient-mapper'
import {
  Order as PrismaOrder,
  OrderState as PrismaOrderState,
  Recipient as PrismaRecipient,
  Prisma,
} from '@prisma/client'

const OrderStateMap = {
  AVAILABLE: 'Available',
  PENDING: 'Pending',
  PICKEDUP: 'PickedUp',
  DELIVERED: 'Delivered',
} as const

type PrismaOrderWithRecipient = PrismaOrder & {
  recipient: PrismaRecipient
}

export class PrismaOrderMapper {
  static toDomain(raw: PrismaOrderWithRecipient): Order {
    const order = Order.create(
      {
        courierId: raw.courierId
          ? new UniqueEntityId(raw.courierId)
          : undefined,
        deliveryDate: raw.deliveryDate ?? undefined,
        pickupDate: raw.pickedUpDate ?? undefined,
        recipient: PrismaRecipientMapper.toDomain(raw.recipient),
        updatedAt: raw.updatedAt,
        createdAt: raw.createdAt,
        state: this.mapOrderStateToDomain(raw.state),
      },
      new UniqueEntityId(raw.id),
    )

    return order
  }

  static toPrisma(order: Order): Prisma.OrderUncheckedCreateInput {
    return {
      id: order.id.toString(),
      recipientId: order.recipient.id.toString(),
      state: this.mapOrderStateToPrisma(order.state),
      courierId: order.courierId?.toString(),
      deliveryDate: order.deliveryDate,
      pickedUpDate: order.pickupDate,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }
  }

  private static mapOrderStateToDomain(
    state: keyof typeof OrderStateMap,
  ): OrderState {
    return OrderStateMap[state] || 'Available'
  }

  private static mapOrderStateToPrisma(state: OrderState): PrismaOrderState {
    const invertedMap = Object.fromEntries(
      Object.entries(OrderStateMap).map(([k, v]) => [v, k]),
    ) as Record<OrderState, PrismaOrderState>

    return invertedMap[state] || 'AVAILABLE' // Fallback para 'AVAILABLE'
  }
}
