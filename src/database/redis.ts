import IORedis from 'ioredis'
import { ENV_REDIS_URL } from '~/config/env'

const redis = new IORedis(ENV_REDIS_URL)
export const initRedis = (): Promise<IORedis.Redis> => {
  return new Promise((resolve, reject) => {
    redis.on('connect', () => {
      resolve(redis)
    })

    redis.on('error', (err: any) => {
      reject(err)
    })
  })
}

export const getRedis = () => {
  return redis
}
