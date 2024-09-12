import { Entity } from 'src/core/entities/entity'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'

interface CourierProps {
  name: string
  cpf: string
  password: string
  neighborhood: string
  city: string
}

export class Courier extends Entity<CourierProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
  }

  get cpf() {
    return this.props.cpf
  }

  set email(cpf: string) {
    this.props.cpf = cpf
  }

  get password() {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
  }

  get neighborhood() {
    return this.props.neighborhood
  }

  set neighborhood(neighborhood: string) {
    this.props.neighborhood = neighborhood
  }

  get city() {
    return this.props.city
  }

  set city(city: string) {
    this.props.city = city
  }

  static create(props: CourierProps, id?: UniqueEntityId) {
    const courier = new Courier(props, id)
    return courier
  }
}
