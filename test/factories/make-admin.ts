import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Admin, AdminProps } from '@/domain/app/enterprise/entities/admin'
import { PrismaAdminMapper } from '@/infra/database/prisma/mappers/prisma-admin-mapper'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { faker } from '@faker-js/faker'
import { Injectable } from '@nestjs/common'
import { Adm as PrismaAdmin } from '@prisma/client'

export const makeAdmin = (
  props: Partial<AdminProps> = {},
  id?: UniqueEntityId,
) => {
  return Admin.create(
    {
      name: faker.person.firstName(),
      password: 'mypassword123',
      email: faker.internet.email(),
      ...props,
    },
    id,
  )
}

@Injectable()
export class AdminFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makeAdmin(
    props: Partial<AdminProps> = {},
    id?: UniqueEntityId,
  ): Promise<PrismaAdmin> {
    const admin = makeAdmin(props, id)

    const prismaAdmin = await this.prisma.adm.create({
      data: PrismaAdminMapper.toPrisma(admin),
    })

    return prismaAdmin
  }
}
