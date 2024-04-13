import { RequestHandler, Request, Response, NextFunction } from 'express'

export const asyncFn = (handler: RequestHandler): RequestHandler =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await handler(req, res, next)
    } catch (err) {
      next(err)
    }
  }
