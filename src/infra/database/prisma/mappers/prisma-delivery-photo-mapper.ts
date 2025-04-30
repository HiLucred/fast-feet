import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { DeliveryPhoto } from "@/domain/app/enterprise/entities/delivery-photo";
import { DeliveryPhoto as PrismaDeliveryPhoto, Prisma } from "@prisma/client";

export class PrismaDeliveryPhotoMapper {
  static toDomain(raw: PrismaDeliveryPhoto): DeliveryPhoto {
    return DeliveryPhoto.create(
      {
        orderId: raw.id,
        title: raw.title,
        url: raw.url,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(deliveryPhoto: DeliveryPhoto): Prisma.DeliveryPhotoUncheckedCreateInput {
    return {
      id: deliveryPhoto.id.toString(),
      orderId: deliveryPhoto.orderId.toString(),
      title: 'TESTE?',
      url: deliveryPhoto.url,
      createdAt: deliveryPhoto.createdAt,
      updatedAt: deliveryPhoto.updatedAt
    }
  }
}