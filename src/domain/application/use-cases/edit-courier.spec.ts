import { makeCourier } from 'test/factories/make-courier'
import { EditCourierUseCase } from './edit-courier'
import { InMemoryCouriersRepository } from 'test/repositories/in-memory-couriers-repository'

let inMemoryCouriersRepository: InMemoryCouriersRepository
let sut: EditCourierUseCase

describe('Edit Courier Use Case', () => {
  beforeEach(() => {
    inMemoryCouriersRepository = new InMemoryCouriersRepository()
    sut = new EditCourierUseCase(inMemoryCouriersRepository)
  })

  it('should be able to edit a courier', async () => {
    const courier = makeCourier({
      name: 'John Doe',
    })
    inMemoryCouriersRepository.create(courier)

    const result = await sut.execute({
      courierId: courier.id.toString,
      name: 'Mark Daniel',
      cpf: '90990909090',
      password: '1231234234',
    })

    expect(result.isRight())
    if (result.isRight()) {
      expect(inMemoryCouriersRepository.couriers[0]).toEqual(
        result.value.courier,
      )
    }
  })
})
