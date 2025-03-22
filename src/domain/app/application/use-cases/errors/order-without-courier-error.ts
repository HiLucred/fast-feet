export class OrderWithoutCourierError extends Error {
  constructor() {
    super('Order without a courier')
  }
}
