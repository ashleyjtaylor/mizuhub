export class BaseError extends Error {
  public statusCode: number
  public reason: string

  constructor(message: string) {
    super(message)

    this.name = this.constructor.name
  }
}
