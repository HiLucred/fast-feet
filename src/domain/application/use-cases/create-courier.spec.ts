import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { CreateCourierUseCase } from './create-courier'
import { FakeHash } from 'test/cryptography/fake-hash'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

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
      name: 'John Doe',
      cpf: '81130130',
      password: '1234567',
      city: 'Curitiba',
      neighborhood: 'Capão Raso',
    })

    expect(courier.isRight()).toBeTruthy()
    expect(inMemoryCouriersRepository.couriers).toHaveLength(1)
  })

  it('should not be able to create a courier with same cpf', async () => {
    const myCpf = '81130130'

    await sut.execute({
      name: 'John Doe',
      cpf: myCpf,
      password: '1234567',
      city: 'Curitiba',
      neighborhood: 'Capão Raso',
    })

    const courier = await sut.execute({
      name: 'John Doe',
      cpf: myCpf,
      password: '1234567',
      city: 'Curitiba',
      neighborhood: 'Capão Raso',
    })

    expect(courier.isLeft()).toBeTruthy()
    if (courier.isLeft()) {
      expect(courier.value).toBeInstanceOf(NotAllowedError)
    }
  })

  it('should not be able to create a courier with hashed password', async () => {
    const myPassword = '1234567'

    const courier = await sut.execute({
      name: 'John Doe',
      cpf: '81130130',
      password: myPassword,
      city: 'Curitiba',
      neighborhood: 'Capão Raso',
    })

    if (courier.isRight()) {
      const hashedPassword = await fakeHash.compare(
        myPassword,
        courier.value.courier.password,
      )
      expect(hashedPassword).toBe(true)
    }
  })
})
