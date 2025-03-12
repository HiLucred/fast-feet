import { CouriersRepository } from '@/domain/app/application/repositories/couriers-repository'
import { Courier } from '@/domain/app/enterprise/entities/courier'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'
import { PrismaCourierMapper } from '../mappers/prisma-courier-mapper'

@Injectable()
export class PrismaCouriersRepository implements CouriersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(courier: Courier): Promise<void> {
    const data = PrismaCourierMapper.toPrisma(courier)

    await this.prisma.courier.create({
      data,
    })
  }

  async delete(courier: Courier): Promise<void> {
    await this.prisma.courier.delete({ where: { id: courier.id.toString() } })
  }

  async save(courier: Courier): Promise<void> {
    await this.prisma.courier.update({
      where: {
        id: courier.id.toString(),
      }, // #TODO: Ver isso depois
      data: {},
    })
  }

  async findById(courierId: string): Promise<Courier | null> {
    const courier = await this.prisma.courier.findUnique({
      where: {
        id: courierId,
      },
    })

    if (!courier) return null

    return PrismaCourierMapper.toDomain(courier)
  }

  async findByCpf(cpf: string): Promise<Courier | null> {
    const courier = await this.prisma.courier.findUnique({
      where: {
        cpf: cpf,
      },
    })

    if (!courier) return null

    return PrismaCourierMapper.toDomain(courier)
  }
}
