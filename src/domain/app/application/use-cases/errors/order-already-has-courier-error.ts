export class OrderAlreadyHasCourierError extends Error {
  constructor() {
    super('Entrega já possui um entregador vinculado.')
  }
}
