import { InMemoryDeliveryPhotosRepository } from 'test/repositories/in-memory-delivery-photos-repository'
import { UploadPhotoDeliveryUseCase } from './upload-photo-delivery'
import { FakeUploader } from 'test/storage/fake-uploader'
import { InMemoryOrdersRepository } from 'test/repositories/in-memory-orders-repository'
import { InMemoryRecipientsRepository } from 'test/repositories/in-memory-recipients-repository'
import { makeOrder } from 'test/factories/make-order'
import { InvalidDeliveryPhotoTypeError } from './errors/invalid-delivery-photo-type'

let inMemoryRecipientsRepository: InMemoryRecipientsRepository
let inMemoryOrdersRepository: InMemoryOrdersRepository

let inMemoryDeliveryPhotosRepository: InMemoryDeliveryPhotosRepository
let fakeUploader: FakeUploader
let sut: UploadPhotoDeliveryUseCase

describe('Upload Photo Delivery Use Case', () => {
  beforeEach(() => {
    inMemoryRecipientsRepository = new InMemoryRecipientsRepository()
    inMemoryOrdersRepository = new InMemoryOrdersRepository(
      inMemoryRecipientsRepository,
    )

    inMemoryDeliveryPhotosRepository = new InMemoryDeliveryPhotosRepository()
    fakeUploader = new FakeUploader()
    sut = new UploadPhotoDeliveryUseCase(
      inMemoryDeliveryPhotosRepository,
      fakeUploader,
    )
  })

  it('should be able to upload photo delivery', async () => {
    const order = makeOrder()
    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString,
      fileName: 'delivery-photo.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    })

    expect(result.isRight()).toBeTruthy()
    expect(fakeUploader.uploads).toHaveLength(1)
    if (result.isRight()) {
      expect(inMemoryDeliveryPhotosRepository.deliveryPhotos[0]).toEqual(
        result.value.deliveryPhoto,
      )
      expect(fakeUploader.uploads[0].url).toEqual(
        result.value.deliveryPhoto.url,
      )
    }
  })

  it('should not be able to upload photo delivery with invalid file type', async () => {
    const order = makeOrder()
    inMemoryOrdersRepository.create(order)

    const result = await sut.execute({
      orderId: order.id.toString,
      fileName: 'delivery-photo.png',
      fileType: 'image/pdf',
      body: Buffer.from(''),
    })

    expect(result.isLeft()).toBeTruthy()
    expect(result.value).toBeInstanceOf(InvalidDeliveryPhotoTypeError)
  })
})
