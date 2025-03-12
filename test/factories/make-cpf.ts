import { CPF } from '@/domain/app/enterprise/entities/value-objects/cpf'

export const makeCpf = (value?: string): CPF => {
  const cpf = CPF.create(value ?? '12345678901')

  if (cpf.isLeft()) {
    throw new Error('Invalid cpf format.')
  }

  return cpf.value
}
