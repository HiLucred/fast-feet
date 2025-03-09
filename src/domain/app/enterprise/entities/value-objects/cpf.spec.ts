import { InvalidDataError } from '@/core/errors/invalid-data-error'
import { CPF } from './cpf'

describe('Cpf Value Object', () => {
  it('should be able to create a valid cpf', () => {
    const VALID_CPF = '81123749811'
    const cpf = CPF.create(VALID_CPF)

    expect(cpf.isRight()).toBeTruthy()
    if (cpf.isRight()) {
      expect(cpf.value).toBeInstanceOf(CPF)
    }
  })

  it('should not be able to create a invalid cpf', () => {
    const INVALID_CPF = '811237498119XXxx@#3293'
    const cpf = CPF.create(INVALID_CPF)

    expect(cpf.isRight()).toBeFalsy()
    expect(cpf.value).toBeInstanceOf(InvalidDataError)
  })
})
