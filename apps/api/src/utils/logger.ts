import path from 'path'
import pino from 'pino'

const isProd = process.env.NODE_ENV === 'prod'

export const logger = pino({
  enabled: !process.env.JEST_WORKER_ID,
  level: process.env.LOG_LEVEL ?? 'info',
  timestamp: pino.stdTimeFunctions.isoTime,
  transport: {
    targets: [
      {
        target: 'pino-pretty',
        level: 'info',
        options: {
          colorize: !isProd,
          colorizeObjects: !isProd,
          singleLine: true,
          translateTime: 'dd-mm-yyyy HH:MM:sstt',
          destination: isProd ? path.join(process.cwd(), 'logs/app.log') : undefined,
          mkdir: true
        }
      }
    ]
  }
})
