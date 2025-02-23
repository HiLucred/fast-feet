import { AdminsRepository } from '@/domain/app/application/repositories/admins-repository'
import { Admin } from '@/domain/app/enterprise/entities/admin'
import { PrismaService } from '../prisma.service'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export class PrismaAdminsRepository implements AdminsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(admin: Admin): Promise<void> {
    await this.prismaService.adm.create({
      data: {
        name: admin.name,
        email: admin.email,
        password: admin.password,
      },
    })
  }

  async findByEmail(email: string): Promise<Admin | null> {
    const admin = await this.prismaService.adm.findFirst({
      where: {
        email,
      },
    })

    if (!admin) return null

    return Admin.create(
      {
        email: admin.email,
        name: admin.email,
        password: admin.password,
      },
      new UniqueEntityId(admin.id),
    )
  }
}
