import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { CreateCourierUseCase } from './create-courier'
import { FakeHash } from 'test/cryptography/fake-hash'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { Courier } from '@/domain/enterprise/entitys/courier'
import { faker } from '@faker-js/faker'

let inMemoryCouriersRepository: InMemoryCouriersRepository
let fakeHash: FakeHash
let sut: CreateCourierUseCase

describe('Create Courier Use Case', () => {
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
      userRole: 'admin',
    })

    expect(courier.isRight()).toBeTruthy()
    expect(inMemoryCouriersRepository.couriers).toHaveLength(1)
    if (courier.isRight()) {
      expect(inMemoryCouriersRepository.couriers[0]).toEqual(
        courier.value.courier,
      )
    }
  })

  it('should not be able to create a courier without role admin', async () => {
    const courier = await sut.execute({
      name: faker.person.fullName(),
      cpf: '888888888',
      password: faker.internet.password(),
      userRole: 'courier',
    })

    expect(courier.isLeft()).toBeTruthy()
    expect(inMemoryCouriersRepository.couriers).toHaveLength(0)
  })

  it('should not be able to create a courier with same cpf', async () => {
    const MY_CPF = '888888888'

    inMemoryCouriersRepository.create(
      Courier.create({
        cpf: MY_CPF,
        name: faker.person.fullName(),
        password: faker.internet.password(),
      }),
    )

    const result = await sut.execute({
      cpf: MY_CPF,
      name: faker.person.fullName(),
      password: faker.internet.password(),
      userRole: 'admin',
    })

    expect(result.isLeft()).toBeTruthy()
    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(NotAllowedError)
    }
  })

  it('should be able to create a courier with hashed password', async () => {
    const MY_PASSWORD = '1234567'

    const courier = await sut.execute({
      password: MY_PASSWORD,
      name: faker.person.fullName(),
      cpf: '888888888',
      userRole: 'admin',
    })

    if (courier.isRight()) {
      const hashedPassword = await fakeHash.compare(
        MY_PASSWORD,
        courier.value.courier.password,
      )
      expect(hashedPassword).toBe(true)
    }
  })
})
