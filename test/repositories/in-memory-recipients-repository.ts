import { RecipientsRepository } from '@/domain/application/repositories/recipients-repository'
import { Recipient } from '@/domain/enterprise/entities/recipient'

export class InMemoryRecipientsRepository implements RecipientsRepository {
  public recipients: Recipient[] = []

  async create(recipient: Recipient): Promise<void> {
    this.recipients.push(recipient)
  }

  async delete(recipient: Recipient): Promise<void> {
    const recipientIndex = this.recipients.findIndex(
      (index) => index.id === recipient.id,
    )

    this.recipients.splice(recipientIndex)
  }

  async save(recipient: Recipient): Promise<void> {
    const recipientIndex = this.recipients.findIndex(
      (index) => index.id === recipient.id,
    )

    this.recipients[recipientIndex] = recipient
  }

  async findById(recipientId: string): Promise<Recipient | null> {
    const recipient = this.recipients.find(
      (recipient) => recipient.id.toString === recipientId,
    )

    if (!recipient) return null

    return recipient
  }
}
