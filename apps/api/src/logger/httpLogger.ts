import { randomUUID } from 'node:crypto'
import { pinoHttp, startTime, stdSerializers} from 'pino-http'
import logger from './logger'

export default pinoHttp({
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
