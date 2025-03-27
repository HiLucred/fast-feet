import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Courier, CourierProps } from '@/domain/app/enterprise/entities/courier'
import { CPF } from '@/domain/app/enterprise/entities/value-objects/cpf'
import { faker } from '@faker-js/faker'
import { makeCpf } from './make-cpf'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaCourierMapper } from '@/infra/database/prisma/mappers/prisma-courier-mapper'
import { Courier as PrismaCourier } from '@prisma/client'

export const makeCourier = (
  props: Partial<CourierProps> = {},
  id?: UniqueEntityId,
) => {
  const cpf = makeCpf()

  return Courier.create(
    {
      name: faker.person.firstName(),
      password: 'mypassword123',
      cpf,
      ...props,
    },
    id,
  )
}

@Injectable()
export class CourierFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaCourier(
    props: Partial<CourierProps> = {},
    id?: UniqueEntityId,
  ): Promise<PrismaCourier> {
    const courier = makeCourier(props, id)

    const prismaCourier = await this.prisma.courier.create({
      data: PrismaCourierMapper.toPrisma(courier),
    })

    return prismaCourier
  }
}
