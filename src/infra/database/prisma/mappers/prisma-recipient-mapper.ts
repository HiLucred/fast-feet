import { Recipient as PrismaRecipient, Prisma } from '@prisma/client'
import { Recipient } from '@/domain/app/enterprise/entities/recipient'
import { Address } from '@/domain/app/enterprise/entities/value-objects/address'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

export class PrismaRecipientMapper {
  static toDomain(raw: PrismaRecipient): Recipient {
    return Recipient.create(
      {
        name: raw.name,
        phoneNumber: raw.phoneNumber,
        address: new Address({
          city: raw.city,
          neighborhood: raw.neighborhood,
          number: raw.number,
          state: raw.state,
          street: raw.street,
          zipCode: raw.zipCode,
        }),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id),
    )
  }

  static toPrisma(recipient: Recipient): Prisma.RecipientUncheckedCreateInput {
    return {
      updatedAt: recipient.updatedAt,
      city: recipient.address.city,
      name: recipient.name,
      neighborhood: recipient.address.neighborhood,
      number: recipient.address.number,
      phoneNumber: recipient.phoneNumber,
      state: recipient.address.state,
      street: recipient.address.street,
      zipCode: recipient.address.zipCode,
      id: recipient.id.toString(),
      createdAt: recipient.createdAt,
    }
  }
}
