import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import bodyParser from 'body-parser'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'

import logger from './logger/logger'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (_req: Request, res: Response, _next: NextFunction) => {
  return res.status(StatusCodes.OK).send(ReasonPhrases.OK)
})

app.get('/health', (_req: Request, res: Response, _next: NextFunction) => {
  return res.status(StatusCodes.OK).send(ReasonPhrases.OK)
})

app.get('*', (_req: Request, res: Response, _next: NextFunction) => {
  return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND)
})

app.use((error: ErrorRequestHandler, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(error, error.name)

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR)
})

export default app
