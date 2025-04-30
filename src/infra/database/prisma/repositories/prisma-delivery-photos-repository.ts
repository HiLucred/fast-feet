import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { DeliveryPhotosRepository } from "@/domain/app/application/repositories/delivery-photos-repository";
import { DeliveryPhoto } from "@/domain/app/enterprise/entities/delivery-photo";
import { PrismaDeliveryPhotoMapper } from "../mappers/prisma-delivery-photo-mapper";

@Injectable()
export class PrismaDeliveryPhotosRepository implements DeliveryPhotosRepository {
  constructor(private readonly prisma: PrismaService) { }

  async create(deliveryPhoto: DeliveryPhoto): Promise<void> {
    const data = PrismaDeliveryPhotoMapper.toPrisma(deliveryPhoto)
    await this.prisma.deliveryPhoto.create({
      data
    })
  }

  async findByOrderId(orderId: string): Promise<DeliveryPhoto | null> {
    const deliveryPhoto = await this.prisma.deliveryPhoto.findUnique({
      where: {
        orderId
      }
    })

    if (!deliveryPhoto) return null

    return PrismaDeliveryPhotoMapper.toDomain(deliveryPhoto)
  }
}