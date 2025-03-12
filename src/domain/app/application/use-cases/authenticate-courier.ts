import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { CouriersRepository } from '../repositories/couriers-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { HashComparer } from '../cryptography/hash-comparer'
import { Encrypter } from '../cryptography/encrypter'
import { Injectable } from '@nestjs/common'

interface AuthenticateCourierUseCaseRequest {
  cpf: string
  password: string
}

type AuthenticateCourierUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { accessToken: string }
>

@Injectable()
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

    const isPasswordValid = await this.hashComparer.compare(
      password,
      courier.password,
    )

    if (!isPasswordValid) {
      return left(new NotAllowedError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: courier.id.toString(),
      role: 'courier',
    })

    return right({ accessToken })
  }
}
