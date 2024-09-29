import { Either, left, right } from '@/core/either'
import { CouriersRepository } from '../repositories/couriers-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Courier } from '@/domain/enterprise/entitys/courier'

interface EditCourierUseCaseRequest {
  courierId: string
  name: string
  cpf: string
  password: string
}

type EditCourierUseCaseResponse = Either<
  ResourceNotFoundError,
  { courier: Courier }
>

export class EditCourierUseCase {
  constructor(private readonly couriersRepository: CouriersRepository) {}

  async execute({
    courierId,
    name,
    cpf,
    password,
  }: EditCourierUseCaseRequest): Promise<EditCourierUseCaseResponse> {
    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    courier.name = name
    courier.cpf = cpf
    courier.password = password

    await this.couriersRepository.save(courier)

    return right({ courier })
  }
}
