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
        target: 'pino-pretty',
        level: 'info',
        options: {
          colorize: false,
          singleLine: true,
          translateTime: 'dd-mm-yyyy HH:MM:sstt',
          destination: path.join(__dirname, '../logs/app.log'),
          mkdir: true
        }
      },
      {
        target: 'pino-pretty',
        level: 'error',
        options: {
          colorize: false,
          translateTime: 'dd-mm-yyyy HH:MM:sstt',
          destination: path.join(__dirname, '../logs/error.log'),
          mkdir: true
        }
      }
    ]
  }
})

export default logger
