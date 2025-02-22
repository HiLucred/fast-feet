import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'
import { DeleteCourierUseCase } from './delete-courier'
import { makeCourier } from 'test/factories/make-courier'

describe('Delete Courier Use Case', () => {
  let inMemoryCouriersRepository: InMemoryCouriersRepository
  let sut: DeleteCourierUseCase

  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    sut = new DeleteCourierUseCase(inMemoryCouriersRepository)
  })

  it('should be able to delete a courier', async () => {
    const courier = makeCourier()
    inMemoryCouriersRepository.create(courier)

    const response = await sut.execute({ courierId: courier.id.toString() })

    expect(response.isRight())
    expect(inMemoryCouriersRepository.couriers).toHaveLength(0)
  })
})
