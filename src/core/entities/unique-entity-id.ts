import { randomUUID } from 'crypto'

export class UniqueEntityId {
  private readonly _value: string

  constructor(value?: string) {
    this._value = value ?? randomUUID()
  }

  get toString() {
    return this._value
  }

  get getValue() {
    return this._value
  }

  equals(value: UniqueEntityId) {
    return this._value === value.toString
  }
}
