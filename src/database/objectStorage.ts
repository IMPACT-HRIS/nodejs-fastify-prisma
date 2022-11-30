import { S3 } from 'aws-sdk'
import Stream from 'stream'
import {
  ENV_OBJECT_STORAGE_ACCESS_KEY_ID,
  ENV_OBJECT_STORAGE_BUCKET_NAME,
  ENV_OBJECT_STORAGE_ENDPOINT,
  ENV_OBJECT_STORAGE_FORCE_PATH_STYLE,
  ENV_OBJECT_STORAGE_SECRET_ACCESS_KEY,
} from '~/config/env'

const client = new S3({
  endpoint: ENV_OBJECT_STORAGE_ENDPOINT || undefined,
  accessKeyId: ENV_OBJECT_STORAGE_ACCESS_KEY_ID,
  secretAccessKey: ENV_OBJECT_STORAGE_SECRET_ACCESS_KEY,
  s3ForcePathStyle: ENV_OBJECT_STORAGE_FORCE_PATH_STYLE,
})

const bucket = ENV_OBJECT_STORAGE_BUCKET_NAME

export const initObjectStorage = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    client.headBucket({ Bucket: bucket }, (err: Error | null) => {
      if (err) return reject(err)
      return resolve()
    })
  })
}

export const uploadFile = async (
  path: string,
  data: S3.Body,
  options?: Partial<S3.PutObjectRequest>,
): Promise<S3.ManagedUpload.SendData> => {
  return new Promise((resolve, reject) => {
    client.upload(
      {
        Bucket: bucket,
        Key: path,
        Body: data,
        ...options,
      },
      (err: Error | null, d) => {
        if (err) return reject(err)
        return resolve(d)
      },
    )
  })
}

export const createUploadStream = (path: string) => {
  const pass = new Stream.PassThrough()

  return {
    stream: pass,
    promise: client
      .upload({
        Bucket: bucket,
        Key: path,
        Body: pass,
      })
      .promise(),
  }
}

export const createDownloadStream = (path: string) => {
  return client
    .getObject({
      Bucket: bucket,
      Key: path,
    })
    .createReadStream()
}

export const deleteObject = async (path: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    client.deleteObject(
      {
        Bucket: bucket,
        Key: path,
      },
      (err: Error | null) => {
        if (err) return reject(err)
        return resolve()
      },
    )
  })
}
