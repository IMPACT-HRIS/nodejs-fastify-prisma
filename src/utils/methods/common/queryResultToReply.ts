const toCamel = (s: string) => {
  return s.replace(/([-_][a-z])/gi, ($1) => {
    return $1.toUpperCase().replace('-', '').replace('_', '')
  })
}

const dateTimeFieldNames = ['start_time', 'end_time', 'answer_time']

export const queryResultToReply: any = ({ inputObject }: { inputObject: any[] }) => {
  const results = inputObject.map((item: any) => {
    const returnObject: any = {}
    if (!item) return item
    Object.entries(item).map(([key, value]) => {
      if (Array.isArray(value) && value.length > 0) {
        returnObject[toCamel(key)] = queryResultToReply({ inputObject: value })
      } else if (value && typeof value === 'object' && !Array.isArray(value) && !dateTimeFieldNames.includes(key)) {
        const newObject: any = {}
        Object.entries(value as any).map(([valueKey, valueValue]) => {
          if (typeof valueValue !== 'object') {
            newObject[toCamel(valueKey)] = valueValue
          } else {
            const [newValueValue] = queryResultToReply({
              inputObject: [valueValue],
            })
            newObject[toCamel(valueKey)] = newValueValue
          }
        })
        returnObject[toCamel(key)] = newObject
      } else {
        returnObject[toCamel(key)] = value
      }
    })
    return returnObject
  })
  return results
}
