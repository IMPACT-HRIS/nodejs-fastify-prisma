import fastifyMultipart, { FastifyMultipartBaseOptions } from '@fastify/multipart'
import { FastifyError, FastifyInstance } from 'fastify'
import fp from 'fastify-plugin'
import fs from 'fs'
import path from 'path'
import pump from 'pump'
import { getMimeType } from 'stream-mime-type'
import { InvalidInputError } from '~/class/Error'
import { encodeFilename } from '~/utils/methods/common/encoder'
export interface customFileInterface {
  filename: string
  filepath: string
  encoding: any
  mimetype: any
}

const parseFormData = (data: any): any => {
  if (data.value !== undefined) {
    return data.value
  }
  if (data.file) {
    return {
      filename: data.filename,
      filepath: data.filepath,
      encoding: data.encoding,
      mimetype: data.mimetype,
    }
  }
  return data
}

export const multipartPlugin = fp(
  (
    app: FastifyInstance,
    opts: Pick<FastifyMultipartBaseOptions, 'limits'> & {
      acceptMimeTypeSet?: Set<string>
    },
    next: (err?: FastifyError) => void,
  ) => {
    try {
      app.register(fastifyMultipart, {
        attachFieldsToBody: true,
        onFile: async (part: any) => {
          if (!fs.existsSync('public/uploads')) {
            fs.mkdirSync('public/uploads', { recursive: true })
          }
          const { stream, mime } = await getMimeType(part.file, { filename: part.filename })
          if (opts.acceptMimeTypeSet && !opts.acceptMimeTypeSet.has(mime))
            throw new InvalidInputError('Invalid mimetype')
          const tempPath = path.join(process.cwd(), 'public/uploads', encodeFilename(part.filename))
          part.filepath = tempPath
          await new Promise((resolve, reject) => {
            pump(stream, fs.createWriteStream(tempPath), (err) => {
              if (err) reject(err)
              else resolve(undefined)
            })
          })
        },
        limits: opts.limits,
      })

      app.addHook('preValidation', async (request) => {
        if (!request.isMultipart()) return

        const body = request.body as Record<string, any>
        const newBody = {} as Record<string, any>
        for (const field of Object.keys(body)) {
          const data = body[field]
          if (field.endsWith('[]')) {
            let newData
            if (Array.isArray(data)) {
              newData = data.map((x) => parseFormData(x))
            } else {
              const parseData = parseFormData(data)
              newData = parseData ? [parseData] : []
            }
            newBody[field.slice(0, -2)] = newData
          } else {
            let newData
            if (Array.isArray(data)) {
              newData = parseFormData(data[data.length - 1])
            } else {
              newData = parseFormData(data)
            }
            newBody[field] = newData
          }
        }
        request.body = newBody
      })
      next()
    } catch (err) {
      console.log(err)
      next()
    }
  },
)
