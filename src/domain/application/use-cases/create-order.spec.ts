import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { CreateOrderUseCase } from './create-order'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sout: CreateOrderUseCase

describe('Create Order Use Case', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )
    sout = new CreateOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to create a order', async () => {
    const result = await sout.execute({
      recipientName: 'fake-recipient-name',
      address: {
        zipCode: '81130130',
        street: 'Ouro Verde',
        number: '10',
        city: 'Curitiba',
        state: 'Paraná',
        neighborhood: 'Capão Raso',
      },
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryOrdersRepository.orders).toHaveLength(1)

    if (result.isRight()) {
      expect(inMemoryOrdersRepository.orders[0]).toEqual(result.value.order)
    }
  })

  it('should be able to create a recipient on database', async () => {
    const result = await sout.execute({
      recipientName: 'fake-recipient-name',
      address: {
        zipCode: '81130130',
        street: 'Ouro Verde',
        number: '10',
        city: 'Curitiba',
        state: 'Paraná',
        neighborhood: 'Capão Raso',
      },
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryRecipientsRepository.recipients).toHaveLength(1)

    if (result.isRight()) {
      expect(inMemoryRecipientsRepository.recipients[0]).toEqual(
        result.value.order.recipient,
      )
    }
  })
})
