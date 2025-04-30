import { UniqueEntityId } from "@/core/entities/unique-entity-id";
import { DeliveryPhoto, DeliveryPhotoProps } from "@/domain/app/enterprise/entities/delivery-photo";
import { PrismaDeliveryPhotoMapper } from "@/infra/database/prisma/mappers/prisma-delivery-photo-mapper";
import { PrismaService } from "@/infra/database/prisma/prisma.service";
import { Injectable } from "@nestjs/common";

export const makeDeliveryPhoto = (photoDelivery: Partial<DeliveryPhotoProps> = {}, id?: UniqueEntityId) => {
  return DeliveryPhoto.create({
    title: 'Default Title',
    url: 'https://example.com/default-photo.jpg',
    orderId: 'default-order-id',
    ...photoDelivery,
  }, id);
};

@Injectable()
export class DeliveryPhotoFactory {
  constructor(private readonly prisma: PrismaService) { }

  async makePrismaDeliveryPhoto(photoDelivery: Partial<DeliveryPhotoProps> = {}, id?: UniqueEntityId) {
    const deliveryPhoto = makeDeliveryPhoto(photoDelivery, id)

    return await this.prisma.deliveryPhoto.create({
      data: PrismaDeliveryPhotoMapper.toPrisma(deliveryPhoto)
    })
  }
}