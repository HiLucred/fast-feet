import { Optional } from '@/core/types/optional'
import { OrderState } from '@/core/types/order-state'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { Recipient } from './recipient'

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

  set state(state: OrderState | undefined) {
    if (state === 'Pending' && this.props.state !== undefined) {
      throw new Error(
        'Cannot set an order to Pending when it has already been defined.',
      )
    }
    if (state === 'PickedUp' && this.props.state !== 'Pending') {
      throw new Error(
        'Cannot set an order to PickedUp when it is not in Pending state.',
      )
    }
    if (state === 'Delivered' && this.props.state !== 'PickedUp') {
      throw new Error(
        'Cannot set an order to Delivered when it is not in PickedUp state.',
      )
    }

    this.props.state = state

    switch (state) {
      case 'PickedUp':
        this.pickupDate = new Date()
        break
      case 'Delivered':
        this.deliveryDate = new Date()
        break
    }

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
