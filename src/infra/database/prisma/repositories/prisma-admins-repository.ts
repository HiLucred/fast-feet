import { AdminsRepository } from '@/domain/app/application/repositories/admins-repository'
import { Admin } from '@/domain/app/enterprise/entities/admin'
import { PrismaService } from '../prisma.service'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'
import { PrismaAdminMapper } from '../mappers/prisma-admin-mapper'

@Injectable()
export class PrismaAdminsRepository implements AdminsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(admin: Admin): Promise<void> {
    const data = PrismaAdminMapper.toPrisma(admin)
    await this.prisma.adm.create({
      data,
    })
  }

  async findByEmail(email: string): Promise<Admin | null> {
    const admin = await this.prisma.adm.findUnique({
      where: {
        email,
      },
    })

    if (!admin) return null

    return PrismaAdminMapper.toDomain(admin)
  }
}
