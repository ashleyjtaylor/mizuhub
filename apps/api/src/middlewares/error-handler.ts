import { Request, Response, NextFunction } from 'express'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'
import { BSONError } from 'bson'
import { ZodError } from 'zod'

import { logger } from '../utils/logger'

import { BaseError } from '../errors/Base'

export const errorHandler = (error: BaseError, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(error)

  if (error instanceof ZodError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      statusCode: StatusCodes.BAD_REQUEST,
      reason: ReasonPhrases.BAD_REQUEST,
      message: 'Invalid data provided',
      details: error.issues
    })
  }

  if (error instanceof BSONError) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      statusCode: StatusCodes.BAD_REQUEST,
      reason: ReasonPhrases.BAD_REQUEST,
      message: 'Invalid id'
    })
  }

  if (error.statusCode) {
    return res.status(error.statusCode).json({
      statusCode: error.statusCode,
      reason: error.reason,
      message: error.message
    })
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    reason: ReasonPhrases.INTERNAL_SERVER_ERROR,
    message:ReasonPhrases.INTERNAL_SERVER_ERROR
  })
}
