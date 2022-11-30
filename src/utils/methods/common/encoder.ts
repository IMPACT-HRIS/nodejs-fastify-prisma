import { nanoid } from 'nanoid'

export const encodeFilename = (filename: string, replaceExtension?: string) => {
  let parsedFilename = filename
  if (replaceExtension) {
    const position = filename.lastIndexOf('.')
    parsedFilename = `${position < 0 ? filename : filename.slice(0, position)}.${replaceExtension}`
  }
  return encodeURI(`${Date.now()}-${nanoid(10)}-${parsedFilename}`)
}
