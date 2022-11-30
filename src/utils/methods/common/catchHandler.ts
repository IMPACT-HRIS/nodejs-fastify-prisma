import { PrismaClientKnownRequestError } from '@prisma/client/runtime'
import { NotFoundError } from '~/class/Error'

export const createPrismaNotFoundCatchHandler = (errorMessage?: string) => (error: unknown) => {
  if (error instanceof PrismaClientKnownRequestError && (error.code === 'P2003' || error.code === 'P2025'))
    throw new NotFoundError(errorMessage)

  throw error
}
