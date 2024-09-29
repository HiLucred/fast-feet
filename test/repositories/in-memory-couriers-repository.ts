import { CouriersRepository } from '@/domain/application/repositories/couriers-repository'
import { Courier } from '@/domain/enterprise/entitys/courier'

export class InMemoryCouriersRepository implements CouriersRepository {
  public couriers: Courier[] = []

  async create(courier: Courier): Promise<void> {
    this.couriers.push(courier)
  }

  async delete(courier: Courier): Promise<void> {
    const courierIndex = this.couriers.findIndex(
      (index) => index.id === courier.id,
    )

    this.couriers.splice(courierIndex)
  }

  async save(courier: Courier): Promise<void> {
    const courierIndex = this.couriers.findIndex(
      (index) => index.id === courier.id,
    )

    this.couriers[courierIndex] = courier
  }

  async findById(courierId: string): Promise<Courier | null> {
    const courier = this.couriers.find(
      (courier) => courier.id.toString === courierId,
    )

    if (!courier) return null

    return courier
  }

  async findByCpf(cpf: string): Promise<Courier | null> {
    const courier = this.couriers.find((courier) => courier.cpf === cpf)

    if (!courier) return null

    return courier
  }
}
