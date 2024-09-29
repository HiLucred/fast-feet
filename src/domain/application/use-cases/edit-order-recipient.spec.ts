import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { EditOrderUseCase } from './edit-order-recipient'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { makeOrder } from 'test/factories/make-order'
import { Recipient } from '@/domain/enterprise/entitys/recipient'
import { Address } from '@/domain/enterprise/value-objects/address'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository
let sut: EditOrderUseCase

describe('Edit Order Recipient Use Case', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )
    sut = new EditOrderUseCase(inMemoryOrdersRepository)
  })

  it('should be able to edit a order', async () => {
    const order = makeOrder({
      recipient: Recipient.create({
        name: 'Gabriel',
        address: new Address({
          zipCode: '808080',
          street: 'R. Any Street',
          city: 'Any City',
          neighborhood: 'Any Neighborhood',
          number: 'Any number',
          state: 'Any state',
        }),
      }),
    })
    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString,
      recipient: { name: 'John Doe', city: 'Rio Branco' },
    })

    expect(result.isRight()).toBeTruthy()
    expect(inMemoryOrdersRepository.orders[0].recipient.name).toEqual(
      'John Doe',
    )
    expect(inMemoryOrdersRepository.orders[0].recipient.address.city).toEqual(
      'Rio Branco',
    )
    expect(
      inMemoryOrdersRepository.orders[0].recipient.address.neighborhood,
    ).toEqual('Any Neighborhood')

    if (result.isRight()) {
      expect(inMemoryRecipientsRepository.recipients[0]).toEqual(
        result.value.order.recipient,
      )
    }
  })
})
