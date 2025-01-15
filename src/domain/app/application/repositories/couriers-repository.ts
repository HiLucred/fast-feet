export abstract class CouriersRepository {
  abstract create(courier: Courier): Promise<void>
  abstract delete(courier: Courier): Promise<void>
  abstract save(courier: Courier): Promise<void>
  abstract findById(courierId: string): Promise<Courier | null>
  abstract findByCpf(cpf: string): Promise<Courier | null>
}
