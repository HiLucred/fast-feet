import { Either, left, right } from '@/core/either'
import { CouriersRepository } from '../repositories/couriers-repository'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { HashGenerator } from '../cryptography/hash-generator'
import { Courier } from '@/domain/enterprise/entities/courier'

interface CreateCourierUseCaseRequest {
  userRole: string
  name: string
  cpf: string
  password: string
}

type CreateCourierUseCaseResponse = Either<
  NotAllowedError,
  { courier: Courier }
>

export class CreateCourierUseCase {
  constructor(
    private readonly courierRepository: CouriersRepository,
    private readonly hashGenerator: HashGenerator,
  ) {}

  async execute({
    userRole,
    name,
    cpf,
    password,
  }: CreateCourierUseCaseRequest): Promise<CreateCourierUseCaseResponse> {
    if (userRole !== 'admin') {
      return left(new NotAllowedError())
    }

    const hasCourierWithSameCpf = await this.courierRepository.findByCpf(cpf)

    if (hasCourierWithSameCpf) {
      return left(new NotAllowedError())
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
