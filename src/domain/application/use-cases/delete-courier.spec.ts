import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { DeleteCourierUseCase } from './delete-courier'
import { makeCourier } from 'test/factories/make-courier'

let inMemoryCouriersRepository: InMemoryCouriersRepository
let sut: DeleteCourierUseCase

describe('Delete Courier Use Case', () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    sut = new DeleteCourierUseCase(inMemoryCouriersRepository)
  })

  it('should be able to delete a courier', async () => {
    const courier = makeCourier()
    inMemoryCouriersRepository.create(courier)

    const response = await sut.execute({
      userRole: 'admin',
      courierId: courier.id.toString,
    })

    expect(response.isRight())
    expect(inMemoryCouriersRepository.couriers).toHaveLength(0)
  })

  it('should not be able to delete a courier without admin role', async () => {
    const courier = makeCourier()
    inMemoryCouriersRepository.create(courier)

    const response = await sut.execute({
      userRole: 'courier',
      courierId: courier.id.toString,
    })

    expect(response.isLeft())
    expect(inMemoryCouriersRepository.couriers).toHaveLength(1)
  })
})
