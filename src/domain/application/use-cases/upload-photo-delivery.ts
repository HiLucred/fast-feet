import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error'
import { DeliveryPhotosRepository } from '../repositories/delivery-photos-repository'
import { Uploader } from '../storage/uploader'
import { DeliveryPhoto } from '@/domain/enterprise/entities/delivery-photo'
import { InvalidDeliveryPhotoTypeError } from './errors/invalid-delivery-photo-type'

interface UploadPhotoDeliveryUseCaseRequest {
  orderId: string
  fileName: string
  fileType: string
  body: Buffer
}

type UploadPhotoDeliveryUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  { deliveryPhoto: DeliveryPhoto }
>

export class UploadPhotoDeliveryUseCase {
  constructor(
    private readonly deliveryPhotosRepository: DeliveryPhotosRepository,
    private readonly uploader: Uploader,
  ) {}

  async execute({
    orderId,
    fileName,
    fileType,
    body,
  }: UploadPhotoDeliveryUseCaseRequest): Promise<UploadPhotoDeliveryUseCaseResponse> {
    const isValidFileType = /^image\/(png|jpeg)$|^application\/pdf$/.test(
      fileType,
    )

    if (!isValidFileType) {
      return left(new InvalidDeliveryPhotoTypeError())
    }

    const { url } = await this.uploader.upload({
      fileName,
      fileType,
      body,
    })

    const deliveryPhoto = DeliveryPhoto.create({
      orderId,
      title: fileName,
      url,
    })

    await this.deliveryPhotosRepository.create(deliveryPhoto)

    return right({ deliveryPhoto })
  }
}
