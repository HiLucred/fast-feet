import { Either, left, right } from '@/core/either'
import { CouriersRepository } from '../repositories/couriers-repository'
import { HashGenerator } from '../cryptography/hash-generator'
import { Courier } from '@/domain/app/enterprise/entities/courier'
import { Injectable } from '@nestjs/common'
import { ConflictError } from '@/core/errors/conflict-error'

interface CreateCourierUseCaseRequest {
  name: string
  cpf: string
  password: string
}

type CreateCourierUseCaseResponse = Either<ConflictError, { courier: Courier }>

@Injectable()
export class CreateCourierUseCase {
  constructor(
    private readonly courierRepository: CouriersRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({
    name,
    cpf,
    password,
  }: CreateCourierUseCaseRequest): Promise<CreateCourierUseCaseResponse> {
    const hasCourierWithSameCpf = await this.courierRepository.findByCpf(cpf)

    if (hasCourierWithSameCpf) {
      return left(new ConflictError())
    }

    const hashedPassword = await this.hashGenerator.hash(password)

    const courier = Courier.create({
      cpf,
      name,
      password: hashedPassword,
    })

    await this.courierRepository.create(courier)

    return right({ courier })
  }
}
