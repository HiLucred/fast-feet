import { makeOrder } from 'test/factories/make-order'
import { FetchOrdersByNeighborhoodUseCase } from './fetch-orders-by-neighborhood'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Recipient } from '../../enterprise/entities/recipient'
import { Address } from '../../enterprise/entities/value-objects/address'

describe('Fetch Order By Neighborhood Use Case', () => {
  let inMemoryRecipientsRepository: InMemoryRecipientsRepository
  let inMemoryOrdersRepository: InMemoryOrdersRepository
  let sut: FetchOrdersByNeighborhoodUseCase

  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )
    sut = new FetchOrdersByNeighborhoodUseCase(inMemoryOrdersRepository)
  })

  it('should be able to fetch courier orders by neighborhood', async () => {
    const FAKE_COURIER_ID = new UniqueEntityId('fake-courier-id')
    const NEIGHBORHOOD = 'Bairro Fictício'

    // Create 10 orders
    for (let i = 0; i < 10; i++) {
      inMemoryOrdersRepository.create(
        makeOrder({
          courierId: FAKE_COURIER_ID,
          state: 'Pending',
          recipient: Recipient.create({
            address: new Address({
              city: 'Cidade',
              neighborhood: NEIGHBORHOOD,
              number: '9832',
              state: 'fake-state',
              street: 'fake-street',
              zipCode: '83928311',
            }),
            name: 'fake-name',
            phoneNumber: '89328932',
          }),
        }),
      )
    }

    // Create 10 orders from another neighborhood
    for (let i = 0; i < 10; i++) {
      inMemoryOrdersRepository.create(
        makeOrder({
          courierId: FAKE_COURIER_ID,
          state: 'Pending',
          recipient: Recipient.create({
            address: new Address({
              city: 'Cidade',
              neighborhood: 'other-neighborhood',
              number: '9832',
              state: 'fake-state',
              street: 'fake-street',
              zipCode: '83928311',
            }),
            name: 'fake-name',
            phoneNumber: '89328932',
          }),
        }),
      )
    }

    const result = await sut.execute({
      neighborhood: NEIGHBORHOOD,
      courierId: FAKE_COURIER_ID.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(result.value.orders).toHaveLength(10)
    }
  })

  it('should not be able to fetch courier orders from another courier', async () => {
    const FAKE_COURIER_ID = new UniqueEntityId('fake-courier-id')
    const FAKE_COURIER_ID_2 = new UniqueEntityId('fake-courier-id-2')

    const NEIGHBORHOOD = 'Bairro Fictício'

    // Create 10 orders from courier 1
    for (let i = 0; i < 10; i++) {
      inMemoryOrdersRepository.create(
        makeOrder({
          courierId: FAKE_COURIER_ID,
          state: 'Pending',
          recipient: Recipient.create({
            address: new Address({
              city: 'Cidade',
              neighborhood: NEIGHBORHOOD,
              number: '9832',
              state: 'fake-state',
              street: 'fake-street',
              zipCode: '83928311',
            }),
            name: 'fake-name',
            phoneNumber: '89328932',
          }),
        }),
      )
    }

    // Create 10 orders from courier 2
    for (let i = 0; i < 10; i++) {
      inMemoryOrdersRepository.create(
        makeOrder({
          courierId: FAKE_COURIER_ID_2,
          state: 'Pending',
          recipient: Recipient.create({
            address: new Address({
              city: 'Cidade',
              neighborhood: 'other-neighborhood',
              number: '9832',
              state: 'fake-state',
              street: 'fake-street',
              zipCode: '83928311',
            }),
            name: 'fake-name',
            phoneNumber: '89328932',
          }),
        }),
      )
    }

    const result = await sut.execute({
      neighborhood: NEIGHBORHOOD,
      courierId: FAKE_COURIER_ID.toString(),
    })

    expect(result.isRight()).toBeTruthy()
    if (result.isRight()) {
      expect(result.value.orders).toHaveLength(10)
    }
  })
})
