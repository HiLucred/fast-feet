import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { CouriersRepository } from '../repositories/couriers-repository'

interface DeleteCourierUseCaseRequest {
  courierId: string
}

type DeleteCourierUseCaseResponse = Either<ResourceNotFoundError, object>

export class DeleteCourierUseCase {
  constructor(private readonly couriersRepository: CouriersRepository) {}

  async execute({
    courierId,
  }: DeleteCourierUseCaseRequest): Promise<DeleteCourierUseCaseResponse> {
    const courier = await this.couriersRepository.findById(courierId)

    if (!courier) {
      return left(new ResourceNotFoundError())
    }

    await this.couriersRepository.delete(courier)

    return right({})
  }
}
