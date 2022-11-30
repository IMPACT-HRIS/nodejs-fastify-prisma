import sharp, { ResizeOptions } from 'sharp'
import { createDownloadStream, createUploadStream } from '~/database/objectStorage'

export const saveImage = async (
  sourcePath: string,
  targetPath: string,
  options:
    | {
        disableResize?: false
        width: number
        height: number
        objectFit?: ResizeOptions['fit']
        background?: ResizeOptions['background']
      }
    | {
        disableResize: true
      },
) => {
  let streamError: Error | undefined

  const downloadStream = createDownloadStream(sourcePath)
  const upload = createUploadStream(targetPath)

  downloadStream
    .on('error', (error) => {
      streamError = error
      upload.stream.end()
    })
    .pipe(
      options.disableResize
        ? sharp()
            .png()
            .on('error', (error) => {
              streamError = error
            })
        : sharp()
            .resize(options.width, options.height, {
              fit: options.objectFit ?? 'cover',
              background: options.background ?? '#00000000',
            })
            .png()
            .on('error', (error) => {
              streamError = error
            }),
    )
    .pipe(upload.stream)

  await upload.promise
  if (streamError) throw streamError
}

export const saveFile = async (sourcePath: string, targetPath: string) => {
  let streamError: Error | undefined

  const downloadStream = createDownloadStream(sourcePath)
  const upload = createUploadStream(targetPath)

  downloadStream
    .on('error', (error) => {
      streamError = error
      upload.stream.end()
    })
    .pipe(upload.stream)

  await upload.promise
  if (streamError) throw streamError
}
