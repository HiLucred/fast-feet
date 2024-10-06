import { Entity } from '@/core/entities/entity'

interface DeliveryPhotoProps {
  orderId: string
  title: string
  url: string
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

  static create(props: DeliveryPhotoProps) {
    const deliveryPhoto = new DeliveryPhoto(props)
    return deliveryPhoto
  }
}
