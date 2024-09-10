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

  get neighborhood() {
    return this.props.neighborhood
  }

  set neighborhood(neighborhood: string) {
    this.props.neighborhood = neighborhood
  }

  get street() {
    return this.props.street
  }

  get number() {
    return this.props.number
  }

  get city() {
    return this.props.city
  }

  get state() {
    return this.props.state
  }

  private getFullAddress() {
    return `R. ${this.street}, ${this.number} - ${this.city}, ${this.state} | ${this.zipCode}`
  }

  toString() {
    return this.getFullAddress()
  }
}
