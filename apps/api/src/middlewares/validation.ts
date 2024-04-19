import { NextFunction, Request, Response } from 'express'
import { ZodSchema } from 'zod'

import { ID_REGEX } from '@/database/schema'
import { BadRequestError } from '@/errors/BadRequest'

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
    if (!req.params.id || !ID_REGEX.test(req.params.id)) {
      throw new BadRequestError('Invalid id')
    }
    next()
  } catch (error) {
    next(error)
  }
}

export const validate = (schema: ZodSchema) => async (req: Request, _res: Response, next: NextFunction) => {
  try {
    if (Object.keys(req.body).length === 0) {
      throw new BadRequestError('Invalid data provided')
    }

    await schema.parse(req.body)

    next()
  } catch (error) {
    next(error)
  }
}
