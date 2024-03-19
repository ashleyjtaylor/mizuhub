import path from 'path'
import pino from 'pino'

const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        options: {
          colorize: true,
          singleLine: true,
          translateTime: 'dd-mm-yyyy HH:MM:sstt'
        }
      },
      {
        target: 'pino/file',
        level: 'info',
        options: {
          destination: path.join(__dirname, '../logs/info.log'),
          mkdir: true
        }
      },
      {
        target: 'pino/file',
        level: 'error',
        options: {
          destination: path.join(__dirname, '../logs/error.log'),
          mkdir: true
        }
      }
    ]
  }
})

export default logger
