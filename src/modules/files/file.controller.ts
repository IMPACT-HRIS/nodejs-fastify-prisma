import { FastifyReply, FastifyRequest } from 'fastify'
import { downloadFile } from '~/database/objectStorage'
import { downloadFileSchema } from '~/modules/files/file.schema'
import { InferZodFastifySchema } from '~/utils/methods/common/zodSchema'

export const downloadFileController = async (
  request: FastifyRequest<InferZodFastifySchema<typeof downloadFileSchema>>,
  reply: FastifyReply,
) => {
  const key = encodeURI(request.params['*'])
  const { response, stream } = await downloadFile(key)
  reply.header('Content-Disposition', `attachment; filename="${key}"`)
  reply.type(response.ContentType || 'application/octet-stream')
  return reply.send(stream)
}
