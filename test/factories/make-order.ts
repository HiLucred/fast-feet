import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Order, OrderProps } from '@/domain/enterprise/entitys/order'
import { Recipient } from '@/domain/enterprise/entitys/recipient'
import { Address } from '@/domain/enterprise/value-objects/address'
import { faker } from '@faker-js/faker'

export const makeOrder = (
  props: Partial<OrderProps> = {},
  id?: UniqueEntityId,
) => {
  const recipient = Recipient.create({
    name: faker.person.firstName(),
    phoneNumber: faker.phone.number(),
    address: new Address({
      zipCode: faker.location.zipCode(),
      street: faker.location.street(),
      neighborhood: faker.location.secondaryAddress(),
      city: faker.location.city(),
      number: faker.location.buildingNumber(),
      state: faker.location.state(),
    }),
  })

  return Order.create({ recipient, ...props }, id)
}
