import { Entity } from 'src/core/entities/entity'
import { UniqueEntityId } from 'src/core/entities/unique-entity-id'
import { CPF } from './value-objects/cpf'
import { left } from '@/core/either'
import { Optional } from '@/core/types/optional'

export interface CourierProps {
  name: string
  cpf: CPF
  password: string
  createdAt: Date
  updatedAt?: Date | null
}

export class Courier extends Entity<CourierProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get cpf() {
    return this.props.cpf
  }

  get password() {
    return this.props.password
  }

  set password(password: string) {
    this.props.password = password
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  updateCpf(cpf: string) {
    const cpfObjectValue = CPF.create(cpf)

    if (cpfObjectValue.isLeft()) return left(cpfObjectValue.value)

    this.props.cpf = cpfObjectValue.value
    this.touch()
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<CourierProps, 'createdAt'>,
    id?: UniqueEntityId,
  ) {
    const courier = new Courier(
      {
        ...props,
        createdAt: new Date(),
      },
      id,
    )
    return courier
  }
}
