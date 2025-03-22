export class OrderAlreadyPendingError extends Error {
  constructor() {
    super('Pedido já está pendente.')
  }
}
