import { Entity } from '@/core/entities/entity'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface DeliveryPhotoProps {
  orderId: string
  title: string
  url: string
  createdAt: Date
  updatedAt?: Date | null
}

export class DeliveryPhoto extends Entity<DeliveryPhotoProps> {
  get orderId() {
    return this.props.orderId
  }

  get title() {
    return this.props.title
  }

  get url() {
    return this.props.url
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

  static create(props: Optional<DeliveryPhotoProps, 'createdAt'>, id?: UniqueEntityId) {
    const deliveryPhoto = new DeliveryPhoto({
      createdAt: props.createdAt ?? new Date(),
      ...props,
    }, id)

    return deliveryPhoto
  }
}
