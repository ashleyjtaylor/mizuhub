import app from './server'
import logger from './logger/logger'

const port = process.env.PORT ?? 3000

app.listen(port, async () => {
  logger.info(`Server running at http://localhost:${port}`)
})

process.on('unhandledRejection', err => {
  logger.fatal(err, 'Unhandled Rejection Error')
  process.exit(1)
})

process.on('SIGTERM', () => {
  logger.error('SIGTERM received. Shutting down gracefully')
  process.exit(0)
})
