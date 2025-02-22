import { Recipient } from '@/domain/app/enterprise/entities/recipient'

export abstract class RecipientsRepository {
  abstract create(recipient: Recipient): Promise<void>
  abstract delete(recipient: Recipient): Promise<void>
  abstract save(recipient: Recipient): Promise<void>
  abstract findById(recipientId: string): Promise<Recipient | null>
}
