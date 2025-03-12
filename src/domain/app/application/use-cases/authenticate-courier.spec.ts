import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { AuthenticateCourierUseCase } from './authenticate-courier'
import { FakeHash } from 'test/cryptography/fake-hash'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { makeCourier } from 'test/factories/make-courier'
import { CPF } from '../../enterprise/entities/value-objects/cpf'
import { makeCpf } from 'test/factories/make-cpf'

describe('Authenticate Courier Use Case', () => {
  let inMemoryCouriersRepository: InMemoryCouriersRepository
  let fakeHash: FakeHash
  let fakeEncrypter: FakeEncrypter
  let sut: AuthenticateCourierUseCase

  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    fakeHash = new FakeHash()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateCourierUseCase(
      inMemoryCouriersRepository,
      fakeHash,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate a courier', async () => {
    const PASSWORD = 'MyPassword999'
    const hashedPassword = await fakeHash.hash(PASSWORD)

    const FAKE_CPF = '12345678901'
    const cpf = makeCpf(FAKE_CPF)

    const courier = makeCourier({
      cpf,
      password: hashedPassword,
    })
    await inMemoryCouriersRepository.create(courier)

    const result = await sut.execute({ cpf: FAKE_CPF, password: PASSWORD })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(result.value).toEqual({
        accessToken: expect.any(String),
      })
    }
  })
})
