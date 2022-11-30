import { ENV_APP_URL } from '~/config/env'

export const parseDate = (dateString: string) => new Date(`${dateString}T00:00:00Z`)

export const parseTime = (timeString: string) => new Date(`1970-01-01T${timeString}Z`)

export const parsePathFromUrl = (url: string) =>
  url.startsWith(`${ENV_APP_URL}/download/`) ? url.slice(ENV_APP_URL.length + 10) : undefined
