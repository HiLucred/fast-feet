import { CouriersRepository } from '@/domain/app/application/repositories/couriers-repository'
import { Courier } from '@/domain/app/enterprise/entities/courier'
import { PrismaService } from '../services/prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaCouriersRepository implements CouriersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(courier: Courier): Promise<void> {
    await this.prisma.courier.create({
      data: {
        cpf: courier.cpf,
        name: courier.name,
        password: courier.password,
      },
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

    return Courier.create({
      cpf: courier.cpf,
      name: courier.name,
      password: courier.password,
    })
  }

  async findByCpf(cpf: string): Promise<Courier | null> {
    const courier = await this.prisma.courier.findUnique({
      where: {
        cpf: cpf,
      },
    })

    if (!courier) return null

    return Courier.create({
      cpf: courier.cpf,
      name: courier.name,
      password: courier.password,
    })
  }
}
