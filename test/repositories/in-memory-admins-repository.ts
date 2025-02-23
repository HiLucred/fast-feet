import { AdminsRepository } from '@/domain/app/application/repositories/admins-repository'
import { Admin } from '@/domain/app/enterprise/entities/admin'

export class InMemoryAdminsRepository implements AdminsRepository {
  public admins: Admin[] = []

  async create(courier: Admin): Promise<void> {
    this.admins.push(courier)
  }

  async findByEmail(email: string): Promise<Admin | null> {
    const admin = this.admins.find((admin) => admin.email === email)

    if (!admin) return null

    return admin
  }
}
