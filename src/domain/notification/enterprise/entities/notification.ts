import { Entity } from '@/core/entities/entity'
import { Optional } from '@/core/types/optional'

interface NotificationProps {
  recipientNumber: string
  content: string
  readAt?: Date | null
  createdAt: Date
}

export class Notification extends Entity<NotificationProps> {
  get recipientNumber() {
    return this.props.recipientNumber
  }

  get content() {
    return this.props.content
  }

  get readAt() {
    return this.props.readAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  read() {
    this.props.readAt = new Date()
  }

  static create(props: Optional<NotificationProps, 'createdAt'>) {
    const notification = new Notification({
      ...props,
      createdAt: props.createdAt ?? new Date(),
    })

    return notification
  }
}
