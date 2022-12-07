const parseSameSiteCookieOption = (sameSite: string) => {
  switch (sameSite) {
    case 'strict':
    case 'lax':
    case 'none':
      return sameSite
    case 'true':
      return true
    default:
      return false
  }
}

// App
export const ENV_APP_URL = process.env.APP_URL ?? 'http://localhost:4000'
export const ENV_APP_PORT = process.env.APP_PORT ?? '4000'
export const ENV_APP_CORS = process.env.APP_CORS ?? ''

// Admin Session
export const ENV_SESSION_SECRET = process.env.SESSION_SECRET ?? ''
export const ENV_SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME ?? ''
export const ENV_SESSION_COOKIE_DOMAIN = process.env.SESSION_COOKIE_DOMAIN || undefined
export const ENV_SESSION_COOKIE_PATH = process.env.SESSION_COOKIE_PATH || undefined
export const ENV_SESSION_COOKIE_SAME_SITE = parseSameSiteCookieOption(process.env.SESSION_COOKIE_SAME_SITE ?? '')
export const ENV_SESSION_COOKIE_SECURE = process.env.SESSION_COOKIE_SECURE === 'true'

// Redis
export const ENV_REDIS_URL = process.env.REDIS_URL ?? ''

// Object Storage
export const ENV_OBJECT_STORAGE_ENDPOINT = process.env.OBJECT_STORAGE_ENDPOINT ?? ''
export const ENV_OBJECT_STORAGE_ACCESS_KEY_ID = process.env.OBJECT_STORAGE_ACCESS_KEY_ID ?? ''
export const ENV_OBJECT_STORAGE_SECRET_ACCESS_KEY = process.env.OBJECT_STORAGE_SECRET_ACCESS_KEY ?? ''
export const ENV_OBJECT_STORAGE_FORCE_PATH_STYLE = process.env.OBJECT_STORAGE_FORCE_PATH_STYLE === 'true'
export const ENV_OBJECT_STORAGE_BUCKET_NAME = process.env.OBJECT_STORAGE_BUCKET_NAME ?? ''

// Email
export const ENV_SENDER_EMAIL = process.env.SENDER_EMAIL ?? ''
export const ENV_SENDER_PASSWORD = process.env.SENDER_PASSWORD ?? ''

// TH SMS
export const ENV_TH_SMS_API_URL = process.env.TH_SMS_API_URL
export const ENV_TH_SMS_API_KEY = process.env.TH_SMS_API_KEY

// SSO
export const ENV_SSO_CLIENT_SECRET = process.env.SSO_CLIENT_SECRET
export const ENV_SSO_URL = process.env.SSO_URL
