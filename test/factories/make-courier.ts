import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Courier, CourierProps } from '@/domain/app/enterprise/entities/courier'
import { CPF } from '@/domain/app/enterprise/entities/value-objects/cpf'
import { faker } from '@faker-js/faker'

export const makeCourier = (
  props: Partial<CourierProps> = {},
  id?: UniqueEntityId,
) => {
  const cpf = CPF.create('12345678901').value as CPF

  return Courier.create(
    {
      name: faker.person.firstName(),
      password: 'mypassword123',
      cpf,
      ...props,
    },
    id,
  )
}
