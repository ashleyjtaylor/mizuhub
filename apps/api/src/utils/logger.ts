import { ServerResponse } from 'http'
import path from 'path'
import pino from 'pino'
import pinoHttp, { startTime } from 'pino-http'

const isProd = process.env.NODE_ENV === 'prod'

const customHttpMessage = (res: ServerResponse) => {
  const responseTime = Date.now() - res[startTime]
  return `${res.req.method} ${res.req.url} ${res.statusCode} - ${responseTime}ms`
}

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

export const httpLogger = pinoHttp({
  logger: logger.child({ name: 'http' }),
  serializers: {
    err: () => ({}),
    req: req => ({ requestId: req.headers['request-id'] }),
    res: () => ({})
  },
  customSuccessMessage(_req, res) {
    return customHttpMessage(res)
  },
  customErrorMessage(_req, res) {
    return customHttpMessage(res)
  }
})

/**
 * customLogLevel: function (_req, res, err) {
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
 */
