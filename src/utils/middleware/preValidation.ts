import { FastifyRequest } from 'fastify'
import { UnauthenticatedError } from '~/class/Error'
import { getUserDataFromRedis, renewToken, verifyToken } from '~/utils/methods/common/token'

export const requireUser = async (request: FastifyRequest) => {
  if (!request.session) throw new UnauthenticatedError()
}

export const requireAdmin = async (request: FastifyRequest) => {
  if (!request.session.admin) throw new UnauthenticatedError()
}

export const requireSSOAdmin = async (request: FastifyRequest) => {
  // TODO: check valid token
  // const requestToken = request?.headers?.authorization?.split(' ')?.[1]
  // if (!requestToken) throw new UnauthenticatedError()
  // const redis = getRedis()
  // const token = await redis.get(
  //   'TF58DMVx8aaL1x3WSw4XM8zMSgZSGfl8wNAouTyNDtOflgttk008LAnJzm5RY1b3tWxfkjxkUgiByJHWCeWGsy6D7qbLUtsQdvPrlnSRLX5qnlzVCsVqFcF91Z2AJNKJWM35HxrUPwJrLcPi6bro6uab5xzsOJbivn1zYyArjTnRS4vRrJm0HFVwxlwZzwTBjxCwaDY1YbNEmYa6tihyMZUl55IFz0MJxCxr1ccDSbmTEV12ld1xiBH2sWM6czpE',
  // )
  // if (!token) throw new UnauthenticatedError()
  // // TODO: check token expire
  // const tokenValue = JSON.parse(token)
  // const isExpired = dayjs(tokenValue.access_token_expired_on).isAfter(dayjs())
  // if (isExpired) throw new UnauthenticatedError()
  return true
}

export const validateAndRenewToken = async ({ userId }: { userId: string }) => {
  const { isAccesTokenValid, isRefreshTokenValid } = await verifyToken({ userId })
  if (isAccesTokenValid) return true
  else if (!isAccesTokenValid && isRefreshTokenValid) {
    const currentSession = await getUserDataFromRedis({ userId })
    await renewToken({ userId, refreshToken: currentSession?.refresh_token })
    return true
  } else {
    return false
  }
}
