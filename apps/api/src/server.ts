import express, { ErrorRequestHandler, NextFunction, Request, Response } from 'express'
import bodyParser from 'body-parser'

import logger from './logger/logger'

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/health', (_req: Request, res: Response, _next: NextFunction) => {
  return res.status(200).send('ok')
})

app.use((error: ErrorRequestHandler, _req: Request, res: Response, _next: NextFunction) => {
  logger.error(error, error.name)

  return res.status(500).json({ error: 'Something went wrong' })
})

export default app
