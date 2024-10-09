interface SendNotificationProps {
  recipientNumber: string
  message: string
}

export abstract class SenderNotification {
  abstract send({
    recipientNumber,
    message,
  }: SendNotificationProps): Promise<void>
}
