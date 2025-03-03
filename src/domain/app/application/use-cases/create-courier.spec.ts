import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { CreateCourierUseCase } from './create-courier'
import { FakeHash } from 'test/cryptography/fake-hash'
import { faker } from '@faker-js/faker'
import { Courier } from '@/domain/app/enterprise/entities/courier'
import { ConflictError } from '@/core/errors/conflict-error'

describe('Create Courier Use Case', () => {
  let inMemoryCouriersRepository: InMemoryCouriersRepository
  let fakeHash: FakeHash
  let sut: CreateCourierUseCase

  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    fakeHash = new FakeHash()
    sut = new CreateCourierUseCase(inMemoryCouriersRepository, fakeHash)
  })

  it('should be able to create a courier', async () => {
    const courier = await sut.execute({
      name: faker.person.fullName(),
      cpf: '888888888',
      password: faker.internet.password(),
    })

    expect(courier.isRight()).toBeTruthy()
    expect(inMemoryCouriersRepository.couriers).toHaveLength(1)
    if (courier.isRight()) {
      expect(inMemoryCouriersRepository.couriers[0]).toEqual(
        courier.value.courier,
      )
    }
  })

  it('should not be able to create a courier with same cpf', async () => {
    const CPF = '888888888'

    inMemoryCouriersRepository.create(
      Courier.create({
        cpf: CPF,
        name: faker.person.fullName(),
        password: faker.internet.password(),
      }),
    )

    const result = await sut.execute({
      cpf: CPF,
      name: faker.person.fullName(),
      password: faker.internet.password(),
    })

    expect(result.isLeft()).toBeTruthy()
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ConflictError)
    }
  })

  it('should be able to create a courier with hashed password', async () => {
    const PASSWORD = '1234567'

    const courier = await sut.execute({
      password: PASSWORD,
      name: faker.person.fullName(),
      cpf: '888888888',
    })

    if (courier.isRight()) {
      const hashedPassword = await fakeHash.compare(
        PASSWORD,
        courier.value.courier.password,
      )
      expect(hashedPassword).toBe(true)
    }
  })
})
