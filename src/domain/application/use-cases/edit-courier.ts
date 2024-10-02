import { Either, left, right } from '@/core/either'
import { CouriersRepository } from '../repositories/couriers-repository'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { Courier } from '@/domain/enterprise/entitys/courier'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

interface EditCourierUseCaseRequest {
  userRole: string
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
    userRole,
    courierId,
    cpf,
    name,
    password,
  }: EditCourierUseCaseRequest): Promise<EditCourierUseCaseResponse> {
    if (userRole !== 'admin') {
      return left(new NotAllowedError())
    }

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
