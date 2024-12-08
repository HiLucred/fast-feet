import { Optional } from '@/core/types/optional'
import { OrderState } from '@/core/types/order-state'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { Recipient } from './recipient'
import { OrderPickedUpEvent } from '../events/order-picked-up-event'
import { OrderDeliveredEvent } from '../events/order-delivered-event'
import { OrderPendingEvent } from '../events/order-pending-event'

export interface OrderProps {
  recipient: Recipient
  courierId?: UniqueEntityId
  state?: OrderState // Pendente, Retirado e Entregue
  pickupDate?: Date // Data de retirada
  deliveryDate?: Date // Data de entrega
  createdAt: Date
  updatedAt?: Date
}

export class Order extends AggregateRoot<OrderProps> {
  get recipient() {
    return this.props.recipient
  }

  set recipient(recipient: Recipient) {
    this.props.recipient = recipient
  }

  get courierId() {
    return this.props.courierId
  }

  set courierId(courierId: UniqueEntityId | undefined) {
    this.props.courierId = courierId
    this.touch()
  }

  get state() {
    return this.props.state
  }

  markAsPending() {
    if (this.props.state !== undefined) {
      throw new Error(
        'Cannot set an order to Pending when it has already been defined.',
      )
    }
    this.props.state = 'Pending'
    this.addDomainEvent(new OrderPendingEvent(this))
    this.touch()
  }

  markAsPickedUp() {
    if (this.props.state !== 'Pending') {
      throw new Error(
        'Cannot set an order to PickedUp when it is not in Pending state.',
      )
    }
    this.props.state = 'PickedUp'
    this.pickupDate = new Date()
    this.addDomainEvent(new OrderPickedUpEvent(this))
    this.touch()
  }

  markAsDelivered() {
    if (this.props.state !== 'PickedUp') {
      throw new Error(
        'Cannot set an order to Delivered when it is not in PickedUp state.',
      )
    }
    this.props.state = 'Delivered'
    this.deliveryDate = new Date()
    this.addDomainEvent(new OrderDeliveredEvent(this))
    this.touch()
  }

  get pickupDate() {
    return this.props.pickupDate
  }

  private set pickupDate(pickupDate: Date | undefined) {
    this.props.pickupDate = pickupDate
    this.touch()
  }

  get deliveryDate() {
    return this.props.deliveryDate
  }

  private set deliveryDate(deliveryDate: Date | undefined) {
    this.props.deliveryDate = deliveryDate
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<OrderProps, 'courierId' | 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const order = new Order(
      {
        createdAt: props.createdAt ?? new Date(),
        ...props,
      },
      id,
    )
    return order
  }
}
