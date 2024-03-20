import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'

import { logger, httpLogger } from './utils/logger'

const app = express()

app.use(httpLogger)
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/', (_req: Request, res: Response, _next: NextFunction) => {
  return res.status(StatusCodes.OK).send(ReasonPhrases.OK)
})

app.get('/health', (_req: Request, res: Response, _next: NextFunction) => {
  return res.status(StatusCodes.OK).send(ReasonPhrases.OK)
})

app.get('/temp-error', (_req: Request, _res: Response, next: NextFunction) => {
  next(new Error('Test error'))
})

app.all('*', (_req: Request, res: Response, _next: NextFunction) => {
  return res.status(StatusCodes.NOT_FOUND).send(ReasonPhrases.NOT_FOUND)
})

app.use((error: ErrorRequestHandler, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(error, error.name)

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(ReasonPhrases.INTERNAL_SERVER_ERROR)
})

export default app
