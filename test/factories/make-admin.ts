import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Admin, AdminProps } from '@/domain/app/enterprise/entities/admin'
import { faker } from '@faker-js/faker'

export const makeAdmin = (
  props: Partial<AdminProps> = {},
  id?: UniqueEntityId,
) => {
  return Admin.create(
    {
      name: faker.person.firstName(),
      password: 'mypassword123',
      email: faker.internet.email(),
      ...props,
    },
    id,
  )
}
