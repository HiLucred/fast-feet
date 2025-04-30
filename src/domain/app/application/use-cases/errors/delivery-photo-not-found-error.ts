export class DeliveryPhotoNotFoundError extends Error {
  constructor() {
    super('Delivery photo not found for the given order.')
  }
}