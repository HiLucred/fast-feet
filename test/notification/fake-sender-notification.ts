import { SenderNotification } from '@/domain/notification/application/sender/sender-notification'

export class FakeSenderNotification implements SenderNotification {
  async send(): Promise<void> {
    console.log('Enviando mensagem...')
  }
}
