export const camelToSnake: any = ({ inputObject }: { inputObject: any }) => {
  const result: any = {}
  Object.entries(inputObject).map(([key, value]) => {
    result[key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)] = value
  })
  return result
}
