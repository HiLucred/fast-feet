import { Entity } from 'src/core/entities/entity'
import { Address } from '../value-objects/address'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'

interface RecipientProps {
  name: string
  address: Address
}

export class Recipient extends Entity<RecipientProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get address() {
    return this.props.address
  }

  set address(address: Address) {
    this.props.address = address
  }

  static create(props: RecipientProps, id?: UniqueEntityId) {
    const recipient = new Recipient(props, id)
    return recipient
  }
}
