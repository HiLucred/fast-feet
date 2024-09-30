import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { CreateOrderUseCase } from './create-order'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { faker } from '@faker-js/faker'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: CreateOrderUseCase

describe('Create Order Use Case', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )
    sut = new CreateOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to create a order', async () => {
    const result = await sut.execute({
      userRole: 'admin',
      recipientName: faker.person.firstName(),
      recipientPhoneNumber: faker.phone.number(),
      address: {
        zipCode: faker.location.zipCode(),
        street: faker.location.street(),
        neighborhood: 'Jardim das Flores',
        city: faker.location.city(),
        number: faker.location.buildingNumber(),
        state: faker.location.state(),
      },
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryOrdersRepository.orders).toHaveLength(1)
    if (result.isRight()) {
      expect(inMemoryOrdersRepository.orders[0]).toEqual(result.value.order)
    }
  })

  it('should not be able to create a order without admin role', async () => {
    const result = await sut.execute({
      userRole: 'courier',
      recipientName: faker.person.firstName(),
      recipientPhoneNumber: faker.phone.number(),
      address: {
        zipCode: faker.location.zipCode(),
        street: faker.location.street(),
        neighborhood: 'Jardim das Flores',
        city: faker.location.city(),
        number: faker.location.buildingNumber(),
        state: faker.location.state(),
      },
    })

    expect(result.isLeft()).toBeTruthy()
    expect(inMemoryOrdersRepository.orders).toHaveLength(0)
  })

  it('should be able to create a recipient on database', async () => {
    const result = await sut.execute({
      userRole: 'admin',
      recipientName: faker.person.firstName(),
      recipientPhoneNumber: faker.phone.number(),
      address: {
        zipCode: faker.location.zipCode(),
        street: faker.location.street(),
        neighborhood: 'Jardim das Flores',
        city: faker.location.city(),
        number: faker.location.buildingNumber(),
        state: faker.location.state(),
      },
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryRecipientsRepository.recipients).toHaveLength(1)
    if (result.isRight()) {
      expect(inMemoryRecipientsRepository.recipients[0]).toEqual(
        result.value.order.recipient,
      )
    }
  })
})
