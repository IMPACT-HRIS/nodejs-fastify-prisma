import fastifyCookie from '@fastify/cookie'
import fastifyCors from '@fastify/cors'
import fastifySession from '@fastify/session'
import createRedisStore from 'connect-redis'
import Fastify from 'fastify'
import fastifyHealthcheck from 'fastify-healthcheck'
import { ZodError } from 'zod'
import { BaseError, InvalidInputErrorCode, UnknownErrorCode } from '~/class/Error'
import {
  ENV_APP_CORS,
  ENV_SESSION_COOKIE_DOMAIN,
  ENV_SESSION_COOKIE_PATH,
  ENV_SESSION_COOKIE_SAME_SITE,
  ENV_SESSION_COOKIE_SECURE,
  ENV_SESSION_SECRET,
} from '~/config/env'
import { SESSION_COOKIE_MAX_AGE, SESSION_COOKIE_NAME } from '~/config/session'
import { initRedis } from '~/database/redis'
import routes from '~/modules/_index'
import zodValidatorCompiler from '~/utils/methods/common/zodValidatorCompiler'

const RedisStore = createRedisStore(fastifySession as any)

export const initApp = async () => {
  const app = Fastify({
    logger: {
      transport: {
        target: 'pino-pretty',
        options: {
          translateTime: 'HH:MM:ss Z',
          ignore: 'pid,hostname',
        },
      },
    },
    disableRequestLogging: true,
  })

  const redis = await initRedis()
  app.log.info('Redis initialization complete')

  app.register(fastifyCors, {
    origin:
      ENV_APP_CORS === '*'
        ? '*'
        : ENV_APP_CORS !== ''
        ? ENV_APP_CORS.split(',').map((regex) => new RegExp(regex))
        : false,
    credentials: true,
  })

  app.register(fastifyCookie)
  app.register(fastifySession, {
    secret: ENV_SESSION_SECRET,
    store: new RedisStore({ client: redis }) as any,
    cookieName: SESSION_COOKIE_NAME,
    cookie: {
      httpOnly: true,
      domain: ENV_SESSION_COOKIE_DOMAIN,
      path: ENV_SESSION_COOKIE_PATH,
      sameSite: ENV_SESSION_COOKIE_SAME_SITE,
      secure: ENV_SESSION_COOKIE_SECURE,
      maxAge: SESSION_COOKIE_MAX_AGE,
    },
  })

  app.register(fastifyHealthcheck, { healthcheckUrl: '/server-health', logLevel: 'warn' })

  app.setValidatorCompiler(zodValidatorCompiler)

  app.register(routes).setErrorHandler((error, request, reply) => {
    if (error instanceof ZodError) {
      const fields = error.issues.map((x) => x.path.join('.')).join(', ')
      reply.status(400).send({
        code: InvalidInputErrorCode,
        message: fields ? `Invalid input: ${fields}` : 'Invalid input',
        payload: {
          issues: error.issues,
        },
      })
      return
    }

    if (error instanceof BaseError) {
      reply.status(error.statusCode).send({
        code: error.code,
        message: error.message,
        payload: error.payload,
      })
      return
    }

    if (error instanceof SyntaxError) {
      reply.status(400).send({
        code: InvalidInputErrorCode,
        message: `SyntaxError: ${error.message}`,
      })
      return
    }

    if (error.code === 'FST_ERR_CTP_INVALID_MEDIA_TYPE') {
      reply.status(400).send({
        code: InvalidInputErrorCode,
        message: `Unsupport Content-Type: ${request.headers['content-type']}`,
      })
      return
    }

    if (error.code === 'FST_REQ_FILE_TOO_LARGE') {
      reply.status(400).send({
        code: InvalidInputErrorCode,
        message: 'File too large',
      })
      return
    }

    if (error.code === 'FST_FILES_LIMIT') {
      reply.status(400).send({
        code: InvalidInputErrorCode,
        message: 'Reach files limit',
      })
      return
    }

    // Sharp invalid file format error
    if (error.message === 'Input buffer contains unsupported image format') {
      reply.status(400).send({
        code: InvalidInputErrorCode,
        message: 'Invalid file format',
      })
      return
    }

    request.log.error(error)
    reply.status(500).send({ code: UnknownErrorCode, message: 'Something went wrong' })
  })

  return app
}
