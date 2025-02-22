import { makeCourier } from 'test/factories/make-courier'
import { EditCourierUseCase } from './edit-courier'
import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { faker } from '@faker-js/faker'

describe('Edit Courier Use Case', () => {
  let inMemoryCouriersRepository: InMemoryCouriersRepository
  let sut: EditCourierUseCase

  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    sut = new EditCourierUseCase(inMemoryCouriersRepository)
  })

  it('should be able to edit a courier', async () => {
    const courier = makeCourier({
      name: 'John Doe',
    })
    inMemoryCouriersRepository.create(courier)

    const result = await sut.execute({
      courierId: courier.id.toString(),
      name: faker.person.firstName(),
      cpf: '90990909090',
      password: faker.internet.password(),
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(inMemoryCouriersRepository.couriers[0]).toEqual(
        result.value.courier,
      )
    }
  })
})
