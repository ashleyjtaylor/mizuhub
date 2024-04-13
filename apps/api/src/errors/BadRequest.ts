import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import { BaseError } from './Base'

export class BadRequestError extends BaseError {
  constructor(message: string) {
    super(message)

    this.statusCode = StatusCodes.BAD_REQUEST
    this.reason = ReasonPhrases.BAD_REQUEST
  }
}
