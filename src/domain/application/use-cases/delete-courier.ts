import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { CouriersRepository } from '../repositories/couriers-repository'
import { NotAllowedError } from '@/core/errors/not-allowed-error'

interface DeleteCourierUseCaseRequest {
  userRole: string
  courierId: string
}

type DeleteCourierUseCaseResponse = Either<ResourceNotFoundError, null>

export class DeleteCourierUseCase {
  constructor(private readonly couriersRepository: CouriersRepository) {}

  async execute({
    userRole,
    courierId,
  }: DeleteCourierUseCaseRequest): Promise<DeleteCourierUseCaseResponse> {
    if (userRole !== 'admin') {
      return left(new NotAllowedError())
    }

    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    await this.couriersRepository.delete(courier)

    return right(null)
  }
}
