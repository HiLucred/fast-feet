import { ValueObject } from 'src/core/entities/value-object'

interface AddressProps {
  zipCode: string
  neighborhood: string
  street: string
  number: string
  city: string
  state: string
}

export class Address extends ValueObject<AddressProps> {
  constructor(props: AddressProps) {
    super(props)
  }

  get zipCode() {
    return this.props.zipCode
  }

  set zipCode(zipCode: string) {
    this.props.zipCode = zipCode
  }

  get neighborhood() {
    return this.props.neighborhood
  }

  set neighborhood(neighborhood: string) {
    this.props.neighborhood = neighborhood
  }

  get street() {
    return this.props.street
  }

  set street(street: string) {
    this.props.street = street
  }

  get number() {
    return this.props.number
  }

  set number(number: string) {
    this.props.number = number
  }

  get city() {
    return this.props.city
  }

  set city(city: string) {
    this.props.city = city
  }

  get state() {
    return this.props.state
  }

  set state(state: string) {
    this.props.state = state
  }

  private getFullAddress() {
    return `R. ${this.street}, ${this.number} - ${this.city}, ${this.state} | ${this.zipCode}`
  }

  toString() {
    return this.getFullAddress()
  }
}
