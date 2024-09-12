import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Courier, CourierProps } from '@/domain/enterprise/entitys/courier'
import { faker } from '@faker-js/faker'

export const makeCourier = (
  props: Partial<CourierProps> = {},
  id?: UniqueEntityId,
) => {
  return Courier.create(
    {
      name: faker.person.firstName(),
      password: 'mypassword123',
      city: faker.location.city(),
      cpf: faker.location.zipCode(),
      neighborhood: 'myneighborhood',
      ...props,
    },
    id,
  )
}
