import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { FakeHash } from 'test/cryptography/fake-hash'
import { AuthenticateAdminUseCase } from './authenticate-admin'
import { InMemoryAdminsRepository } from 'test/repositories/in-memory-admins-repository'
import { makeAdmin } from 'test/factories/make-admin'

describe('Authenticate Admin', () => {
  let inMemoryAdminsRepository: InMemoryAdminsRepository
  let fakeHash: FakeHash
  let fakeEncrypter: FakeEncrypter
  let sut: AuthenticateAdminUseCase

  beforeEach(() => {
    inMemoryAdminsRepository = new InMemoryAdminsRepository()
    fakeHash = new FakeHash()
    fakeEncrypter = new FakeEncrypter()
    sut = new AuthenticateAdminUseCase(
      inMemoryAdminsRepository,
      fakeHash,
      fakeEncrypter,
    )
  })

  it('should be able to authenticate admin', async () => {
    const EMAIL = 'johndoe@email.com'
    const PASSWORD = 'mypassword'

    const admin = makeAdmin({ email: EMAIL, password: PASSWORD })
    await inMemoryAdminsRepository.create(admin)

    const result = await sut.execute({
      email: EMAIL,
      password: PASSWORD,
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(result.value).toEqual({
        accessToken: expect.any(String),
      })
    }
  })
})
