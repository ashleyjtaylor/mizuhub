import express, { NextFunction, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import bodyParser from 'body-parser'
import { StatusCodes, ReasonPhrases } from 'http-status-codes'

import { errorHandler } from '@/middlewares/error-handler'
import { NotFoundError } from '@/errors/NotFound'
import { createId } from '@/utils/create-id'
import { httpLogger } from '@/utils/logger'

import contactRouter from '@/modules/contacts/router'
import productRouter from '@/modules/products/router'

const app = express()

app.use(helmet())
app.use(cors({ origin: true }))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use((req: Request, res: Response, next: NextFunction) => {
  const reqId =  createId('req', 16)
  req.headers['request-id'] = reqId
  res.setHeader('request-id', reqId)
  next()
})

app.use(httpLogger)

app.use('/contacts', contactRouter)
app.use('/products', productRouter)

app.get('/', (_req: Request, res: Response, _next: NextFunction) => {
  return res.status(StatusCodes.OK).send(ReasonPhrases.OK)
})

app.get('/health', (_req: Request, res: Response, _next: NextFunction) => {
  return res.status(StatusCodes.OK).send(ReasonPhrases.OK)
})

app.get('/500', (_req: Request, _res: Response, next: NextFunction) => {
  next(new Error('Something went wrong'))
})

app.all('*', (_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError('Resource not found'))
})

app.use(errorHandler)

export default app
