import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Admin } from '@/domain/app/enterprise/entities/admin'
import { Prisma, Adm as PrismaAdmin } from '@prisma/client'

export class PrismaAdminMapper {
  static toDomain(raw: PrismaAdmin): Admin {
    return Admin.create(
      {
        name: raw.name,
        email: raw.email,
        password: raw.password,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(admin: Admin): Prisma.AdmUncheckedCreateInput {
    return {
      id: admin.id.toString(),
      name: admin.name,
      email: admin.email,
      password: admin.password,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
    }
  }
}
