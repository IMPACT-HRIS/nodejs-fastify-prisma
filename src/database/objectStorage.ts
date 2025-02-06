import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { createReadStream } from 'fs' // Import createReadStream
import { Readable } from 'stream'
import { NotFoundError } from '~/class/Error'
import {
  ENV_OBJECT_STORAGE_ACCESS_KEY_ID,
  ENV_OBJECT_STORAGE_BUCKET_NAME,
  ENV_OBJECT_STORAGE_SECRET_ACCESS_KEY,
} from '~/config/env'
import { customFileInterface } from '~/utils/methods/fastify/fastifyPlugin'

const region = 'ap-southeast-1'

const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId: ENV_OBJECT_STORAGE_ACCESS_KEY_ID,
    secretAccessKey: ENV_OBJECT_STORAGE_SECRET_ACCESS_KEY,
  },
})
const bucket = ENV_OBJECT_STORAGE_BUCKET_NAME

export const uploadFile = async (file: customFileInterface, key: string) => {
  const params = {
    Bucket: bucket,
    Key: key,
    Body: createReadStream(file.filepath),
  }
  try {
    const command = new PutObjectCommand(params)
    await s3Client.send(command)
  } catch (error) {
    console.error('Error uploading file to S3:', error)
    throw error
  }
}

export const downloadFile = async (key: string) => {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  })
  const response = await s3Client.send(command)

  if (!response.Body) {
    throw new NotFoundError('File not found')
  }

  const stream = response.Body as Readable
  return { response, stream }
}
