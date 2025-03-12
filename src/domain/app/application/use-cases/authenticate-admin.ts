import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { HashComparer } from '../cryptography/hash-comparer'
import { Encrypter } from '../cryptography/encrypter'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { AdminsRepository } from '../repositories/admins-repository'
import { Injectable } from '@nestjs/common'

interface AuthenticateAdminUseCaseRequest {
  email: string
  password: string
}

type AuthenticateAdminUseCaseResponse = Either<
  WrongCredentialsError,
  { accessToken: string }
>

@Injectable()
export class AuthenticateAdminUseCase {
  constructor(
    private readonly adminsRepository: AdminsRepository,
    private readonly hashComparer: HashComparer,
    private readonly encrypter: Encrypter,
  ) {}

  async execute({
    email,
    password,
  }: AuthenticateAdminUseCaseRequest): Promise<AuthenticateAdminUseCaseResponse> {
    const admin = await this.adminsRepository.findByEmail(email)

    if (!admin) {
      return left(new ResourceNotFoundError())
    }

    const isPasswordValid = await this.hashComparer.compare(
      password,
      admin.password,
    )

    if (!isPasswordValid) {
      return left(new WrongCredentialsError())
    }

    const accessToken = await this.encrypter.encrypt({
      sub: admin.id.toString(),
      role: 'admin',
    })

    return right({ accessToken })
  }
}
