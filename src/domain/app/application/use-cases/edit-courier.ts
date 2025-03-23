import { Either, left, right } from '@/core/either'
import { CouriersRepository } from '../repositories/couriers-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { Courier } from '@/domain/app/enterprise/entities/courier'
import { CPF } from '@/domain/app/enterprise/entities/value-objects/cpf'
import { Injectable } from '@nestjs/common'
import { InvalidDataError } from '@/core/errors/invalid-data-error'
import { HashGenerator } from '../cryptography/hash-generator'

interface EditCourierUseCaseRequest {
  courierId: string
  cpf?: string
  name?: string
  password?: string
}

type EditCourierUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError | InvalidDataError,
  { courier: Courier }
>

@Injectable()
export class EditCourierUseCase {
  constructor(
    private readonly couriersRepository: CouriersRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({
    courierId,
    cpf,
    name,
    password,
  }: EditCourierUseCaseRequest): Promise<EditCourierUseCaseResponse> {
    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    const cpfUpdated = CPF.create(cpf ?? courier.cpf.toString())

    if (cpfUpdated.isLeft()) {
      return left(cpfUpdated.value)
    }

    courier.updateCpf(cpfUpdated.value.toString())
    courier.name = name ?? courier.name

    const passwordHashed = await this.hashGenerator.hash(courier.password)
    courier.password = password ? passwordHashed : courier.password

    await this.couriersRepository.save(courier)

    return right({ courier })
  }
}
