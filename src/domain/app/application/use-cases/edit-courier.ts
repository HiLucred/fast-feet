import { Either, left, right } from '@/core/either'
import { CouriersRepository } from '../repositories/couriers-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { Courier } from '@/domain/app/enterprise/entities/courier'
import { CPF } from '@/domain/app/enterprise/entities/value-objects/cpf'

interface EditCourierUseCaseRequest {
  courierId: string
  cpf: string
  name: string
  password: string
}

type EditCourierUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  { courier: Courier }
>

export class EditCourierUseCase {
  constructor(private readonly couriersRepository: CouriersRepository) {}

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

    const cpfUpdated = CPF.create(cpf)

    if (cpfUpdated.isLeft()) {
      return left(cpfUpdated.value)
    }

    courier.updateCpf(cpfUpdated.value.toString())
    courier.name = name
    courier.password = password

    await this.couriersRepository.save(courier)

    return right({ courier })
  }
}
