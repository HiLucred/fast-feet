import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { CouriersRepository } from '../repositories/couriers-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { HashComparer } from '../cryptography/hash-comparer'
import { Encrypter } from '../cryptography/encrypter'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

interface AuthenticateCourierUseCaseRequest {
  cpf: string
  password: string
}

type AuthenticateCourierUseCaseResponse = Either<
  WrongCredentialsError,
  { accessToken: string }
>

export class AuthenticateCourierUseCase {
  constructor(
    private readonly couriersRepository: CouriersRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
  ) {}

  async execute({
    cpf,
    password,
  }: AuthenticateCourierUseCaseRequest): Promise<AuthenticateCourierUseCaseResponse> {
    const courier = await this.couriersRepository.findByCpf(cpf)

    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    const isPasswordValid = this.hashComparer.compare(
      password,
      courier.password,
    )

    if (!isPasswordValid) {
      return left(new NotAllowedError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: courier.id.toString(),
    })

    return right({ accessToken })
  }
}
