import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import { BaseError } from './Base'

export class NotFoundError extends BaseError {
  constructor(message: string) {
    super(message)

    this.statusCode = StatusCodes.NOT_FOUND
    this.reason = ReasonPhrases.NOT_FOUND
  }
}
