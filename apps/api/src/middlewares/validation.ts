import { NextFunction, Request, Response } from 'express'
import { ObjectId } from 'mongodb'
import { ZodSchema } from 'zod'
import { BadRequestError } from '../errors/BadRequest'

export const validateListQueryParams = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const page = Number(req.query.p || 1)

    if (Number.isNaN(page)) {
      throw new BadRequestError('Invalid query page')
    }

    next()
  } catch (error) {
    next(error)
  }
}

export const validateId = (req: Request, _res: Response, next: NextFunction) => {
  try {
    new ObjectId(req.params.id)
    next()
  } catch (error) {
    next(error)
  }
}

export const validateBody = (req: Request, _res: Response, next: NextFunction) => {
  try {
    const empty = Object.keys(req.body)

    if (empty.length === 0) {
      throw new BadRequestError('Invalid data provided')
    }

    next()
  } catch (error) {
    next(error)
  }
}

export const validate = (schema: ZodSchema) => async (req: Request, _res: Response, next: NextFunction) => {
  try {
    await schema.parse(req.body)

    next()
  } catch (error) {
    next(error)
  }
}
