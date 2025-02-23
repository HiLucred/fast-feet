import { Admin } from '../../enterprise/entities/admin'

export abstract class AdminsRepository {
  abstract create(admin: Admin): Promise<void>
  abstract findByEmail(email: string): Promise<Admin | null>
}
