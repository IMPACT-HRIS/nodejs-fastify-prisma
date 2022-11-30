import axios from 'axios'
import dayjs from 'dayjs'
import { ENV_SSO_CLIENT_SECRET, ENV_SSO_URL } from '~/config/env'
import { getRedis } from '~/database/redis'

const redis = getRedis()

export const saveUserDataToRedis = async ({ userId, data }: { userId: string; data: any }) => {
  await redis.set(userId, JSON.stringify(data))
  return true
}

export const getUserDataFromRedis = async ({ userId }: { userId: string }) => {
  const user = await redis.get(userId)
  return JSON.parse(user ?? '')
}

export const verifyToken = async ({ userId }: { userId: string }) => {
  const user = await getUserDataFromRedis({ userId })
  const isAccesTokenValid = dayjs(user?.access_token_expired_on).isAfter(dayjs())
  const isRefreshTokenValid = dayjs(user?.refresh_token_expired_on).isAfter(dayjs())
  return { isAccesTokenValid, isRefreshTokenValid }
}

export const renewToken = async ({ userId, refreshToken }: { userId: string; refreshToken: string }) => {
  const result = await axios.post(`${ENV_SSO_URL}/api/v1/signin/oauth2/token`, {
    client_id: 'im',
    client_secret: ENV_SSO_CLIENT_SECRET,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  })
  await saveUserDataToRedis({ userId, data: result?.data })
  return result?.data
}
