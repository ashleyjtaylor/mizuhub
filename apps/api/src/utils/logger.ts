import path from 'path'
import pino from 'pino'
import { randomUUID } from 'node:crypto'
import { pinoHttp, startTime, stdSerializers} from 'pino-http'

export const logger = pino({
  enabled: !process.env.JEST_WORKER_ID,
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

export const httpLogger = pinoHttp({
  logger: logger.child({ name: 'http' }),
  quietReqLogger: true,
  serializers: {
    err: stdSerializers.err,
    req: () => ({}),
    res: () => ({})
  },
  genReqId: (req, res) => {
    const id = req.headers['x-request-id'] ?? randomUUID()
    res.setHeader('X-Request-Id', id)
    return id
  },
  customLogLevel: function (_req, res, err) {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return 'warn'
    } else if (res.statusCode >= 500 || err) {
      return 'error'
    }
    return 'info'
  },
  customSuccessMessage(_req, res) {
    const responseTime = Date.now() - res[startTime]
    return `${res.req.method} ${res.req.url} ${res.statusCode} - ${responseTime}ms`
  },
  customErrorMessage(_err, res) {
    const responseTime = Date.now() - res[startTime]
    return `${res.req.method} ${res.req.url} ${res.statusCode} - ${responseTime}ms`
  }
})
