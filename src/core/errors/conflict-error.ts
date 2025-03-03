export class ConflictError extends Error {
  constructor() {
    super('Data already exists with the same value(s).')
  }
}
