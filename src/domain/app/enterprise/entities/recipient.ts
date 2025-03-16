import { Entity } from 'src/core/entities/entity'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { Address } from './value-objects/address'
import { Optional } from '@/core/types/optional'

interface RecipientProps {
  name: string
  phoneNumber: string
  address: Address
  createdAt: Date
  updatedAt?: Date | null
}

export class Recipient extends Entity<RecipientProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get phoneNumber() {
    return this.props.phoneNumber
  }

  set phoneNumber(phoneNumber: string) {
    this.props.phoneNumber = phoneNumber
  }

  get address() {
    return this.props.address
  }

  set address(address: Address) {
    this.props.address = address
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(
    props: Optional<RecipientProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const recipient = new Recipient(
      {
        createdAt: props.createdAt ?? new Date(),
        ...props,
      },
      id,
    )
    return recipient
  }
}
