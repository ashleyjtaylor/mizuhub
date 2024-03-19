import app from './server'
import logger from './logger/logger'

const port = process.env.PORT ?? 3000

const server = app.listen(port, async () => {
  logger.info(`Server running at http://localhost:${port}`)
})

process.on('unhandledRejection', (err) => {
  logger.fatal(err, 'Unhandled Rejection Error')
  server.close(() => { process.exit(1) })
})

process.on('SIGTERM', () => {
  logger.error('SIGTERM received. Shutting down gracefully')
  server.close(() => { process.exit(0) })
})
