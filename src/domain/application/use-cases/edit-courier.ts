import { Either, left, right } from '@/core/either'
import { CouriersRepository } from '../repositories/couriers-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { Courier } from '@/domain/enterprise/entities/courier'

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

    courier.cpf = cpf
    courier.name = name
    courier.password = password

    await this.couriersRepository.save(courier)

    return right({ courier })
  }
}
