import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Courier } from '@/domain/app/enterprise/entities/courier'
import { CPF } from '@/domain/app/enterprise/entities/value-objects/cpf'
import { Prisma, Courier as PrismaCourier } from '@prisma/client'

export class PrismaCourierMapper {
  static toDomain(raw: PrismaCourier): Courier {
    const cpf = CPF.create(raw.cpf)
    if (cpf.isLeft()) {
      throw new Error(cpf.value.message)
    }

    return Courier.create(
      {
        name: raw.name,
        cpf: cpf.value,
        password: raw.password,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(courier: Courier): Prisma.CourierUncheckedCreateInput {
    return {
      id: courier.id.toString(),
      name: courier.name,
      cpf: courier.cpf.toString(),
      createdAt: courier.createdAt,
      password: courier.password,
      updatedAt: courier.updatedAt,
    }
  }
}
