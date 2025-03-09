import { Either, left, right } from '@/core/either'
import { InvalidDataError } from '@/core/errors/invalid-data-error'

export class CPF {
  protected constructor(private readonly _value: string) {}

  toString() {
    return this._value
  }

  equals(valueObject: CPF) {
    return this._value === valueObject._value.toString()
  }

  static create(value: string): Either<InvalidDataError, CPF> {
    const cleanedCpf = value.replace(/[^\d]/g, '') // Remove todo caractere não numerico

    if (cleanedCpf.length !== 11) {
      return left(new InvalidDataError('CPF deve ter 11 caracteres numéricos'))
    }

    return right(new CPF(cleanedCpf))
  }
}
