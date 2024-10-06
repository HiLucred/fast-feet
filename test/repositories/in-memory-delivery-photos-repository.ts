import { DeliveryPhotosRepository } from '@/domain/application/repositories/delivery-photos-repository'
import { DeliveryPhoto } from '@/domain/enterprise/entities/delivery-photo'

export class InMemoryDeliveryPhotosRepository
  implements DeliveryPhotosRepository
{
  public deliveryPhotos: DeliveryPhoto[] = []

  async create(deliveryPhoto: DeliveryPhoto): Promise<void> {
    this.deliveryPhotos.push(deliveryPhoto)
  }

  async findByOrderId(orderId: string): Promise<DeliveryPhoto | null> {
    const deliveryPhoto = this.deliveryPhotos.find(
      (deliveryPhoto) => deliveryPhoto.orderId === orderId,
    )
    if (!deliveryPhoto) return null
    return deliveryPhoto
  }
}
