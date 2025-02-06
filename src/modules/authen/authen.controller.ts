import { FastifyReply, FastifyRequest } from 'fastify'
import { UnauthenticatedError } from '~/class/Error'
import { ENV_SESSION_COOKIE_DOMAIN, ENV_SESSION_COOKIE_PATH } from '~/config/env'
import { SESSION_COOKIE_NAME } from '~/config/session'
import { loginSchema, registerSchema } from '~/modules/authen/authen.schema'
import { comparePassword, createUser, findUserByUserId, findUserByUsername } from '~/modules/users/user.service'
import { InferZodFastifySchema } from '~/utils/methods/common/zodSchema'

export const isLoggedInController = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  try {
    if (!request.session.user?.userId) return reply.send({ isLoggedIn: false, user: null })
    const foundUser = await findUserByUserId(request.session.user.userId)
    if (!foundUser) {
      return request.session.destroy(() => {
        reply.setCookie(SESSION_COOKIE_NAME, '', { maxAge: -1, path: ENV_SESSION_COOKIE_PATH })
        return reply.send()
      })
    }
    return reply.send({
      isLoggedIn: Boolean(request.session.user),
      user: foundUser
        ? {
            userId: foundUser?.userId,
            username: foundUser?.username,
            imgUrl: foundUser?.imgUrl,
          }
        : request.session.user,
    })
  } catch (err: any) {
    console.log(err)
    return reply.status(500).send({ error: err?.message ?? 'Internal Server Error' })
  }
}

export const loginController = async (
  request: FastifyRequest<InferZodFastifySchema<typeof loginSchema>>,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const username = request.body.username.trim()
    const foundUser = await findUserByUsername(username)

    if (!foundUser) throw new UnauthenticatedError('Invalid username or password')

    const isValidPassword = await comparePassword(foundUser.password, request.body.password)
    if (!isValidPassword) throw new UnauthenticatedError('Invalid username or password')

    const sessionBody = {
      userId: foundUser?.userId,
      isLoggedIn: true,
      imgUrl: foundUser?.imgUrl,
    }

    request.session.user = sessionBody
    return reply.send(sessionBody)
  } catch (err: any) {
    return reply.status(500).send({ error: err?.message ?? 'Internal Server Error' })
  }
}

export const logoutController = async (request: FastifyRequest, reply: FastifyReply): Promise<void> => {
  try {
    request.session.destroy(() => {
      reply.setCookie(SESSION_COOKIE_NAME, '', {
        maxAge: -1,
        path: ENV_SESSION_COOKIE_PATH,
        domain: ENV_SESSION_COOKIE_DOMAIN,
      })
      return reply.send()
    })
  } catch (err: any) {
    console.log(err)
    return reply.status(500).send({ error: err?.message ?? 'Internal Server Error' })
  }
}

export const registerController = async (
  request: FastifyRequest<InferZodFastifySchema<typeof registerSchema>>,
  reply: FastifyReply,
): Promise<void> => {
  try {
    const { password } = request.body
    const username = request.body.username.trim()
    const foundUser = await findUserByUsername(username)
    if (foundUser) return reply.status(400).send({ error: 'User already registered' })
    const user = await createUser({ username, password })
    return reply.send({ userId: user.userId })
  } catch (err: any) {
    console.log(err)
    return reply.status(500).send({ error: err?.message ?? 'Internal Server Error' })
  }
}
