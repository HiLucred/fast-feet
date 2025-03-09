import { Entity } from 'src/core/entities/entity'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { CPF } from './value-objects/cpf'
import { left } from '@/core/either'

export interface CourierProps {
  name: string
  cpf: CPF
  password: string
}

export class Courier extends Entity<CourierProps> {
  get name() {
    return this.props.name
  }

  get cpf() {
    return this.props.cpf
  }

  get password() {
    return this.props.password
  }

  set name(name: string) {
    this.props.name = name
  }

  set password(password: string) {
    this.props.password = password
  }

  updateCpf(cpf: string) {
    const cpfObjectValue = CPF.create(cpf)

    if (cpfObjectValue.isLeft()) return left(cpfObjectValue.value)

    this.props.cpf = cpfObjectValue.value
  }

  static create(props: CourierProps, id?: UniqueEntityId) {
    const courier = new Courier(props, id)
    return courier
  }
}
