import { DeliveryPhoto } from '@/domain/enterprise/entities/delivery-photo'

export abstract class DeliveryPhotosRepository {
  abstract create(deliveryPhoto: DeliveryPhoto): Promise<void>
  abstract findByOrderId(orderId: string): Promise<DeliveryPhoto | null>
}
