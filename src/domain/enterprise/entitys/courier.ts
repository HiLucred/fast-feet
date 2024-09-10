import { Entity } from 'src/core/entity'
import { LocationCoordinate } from '../value-objects/location-coordinate'
import { UniqueEntityId } from 'src/core/unique-entity-id'

interface CourierProps {
  name: string
  email: string
  password: string
  location: LocationCoordinate
}

export class Courier extends Entity<CourierProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.name = name
  }

  get email() {
    return this.props.name
  }

  set email(email: string) {
    this.email = email
  }

  get password() {
    return this.props.name
  }

  set password(password: string) {
    this.password = password
  }

  get location() {
    return this.props.location
  }

  set location(location: LocationCoordinate) {
    this.props.location = location
  }

  static create(props: CourierProps, id?: UniqueEntityId) {
    const courier = new Courier(props, id)
    return courier
  }
}
