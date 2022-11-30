import ms from 'ms'
import { ENV_SESSION_COOKIE_NAME } from '~/config/env'

export const SESSION_COOKIE_NAME = ENV_SESSION_COOKIE_NAME
export const SESSION_COOKIE_MAX_AGE = ms('1d')
