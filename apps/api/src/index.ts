import server from './server'
import logger from './logger/logger'

const port = process.env.PORT ?? 3000

server.listen(port, async () => {
  logger.info(`Server running at http://localhost:${port}`)
})
