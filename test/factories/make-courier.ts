import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Courier, CourierProps } from '@/domain/enterprise/entities/courier'
import { faker } from '@faker-js/faker'

export const makeCourier = (
  props: Partial<CourierProps> = {},
  id?: UniqueEntityId,
) => {
  return Courier.create(
    {
      name: faker.person.firstName(),
      password: 'mypassword123',
      cpf: faker.location.zipCode(),
      ...props,
    },
    id,
  )
}
