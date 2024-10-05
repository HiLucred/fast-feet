import { Entity } from 'src/core/entities/entity'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'

export interface CourierProps {
  name: string
  cpf: string
  password: string
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

  set cpf(cpf: string) {
    const cleanedCpf = cpf.replace(/[^\d]/g, '')

    if (cleanedCpf.length !== 11) {
      throw new Error('CPF deve ter 11 caracteres numéricos')
    }

    cleanedCpf.split('').every((digit) => digit === cpf[0])
    this.props.cpf = cleanedCpf
  }

  get password() {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
  }

  static create(props: CourierProps, id?: UniqueEntityId) {
    const courier = new Courier(props, id)
    return courier
  }
}
