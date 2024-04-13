import app from './app'
import { client } from './database/connection'
import { logger } from './utils/logger'

const port = process.env.PORT ?? 3000

client.connect().then(() => {
  logger.info({ db: client.db().databaseName }, 'Connected to database')

  app.listen(port, () => {
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
}).catch(err => {
  logger.fatal({ err })
  process.exit(1)
})
