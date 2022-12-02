import _ from 'lodash'

export const snakeToCamel = (obj: any) =>
  _.transform(obj, (acc: any, value: any, key: any, target: any) => {
    const camelKey = _.isArray(target) ? key : _.camelCase(key)

    acc[camelKey] = _.isObject(value) ? snakeToCamel(value) : value
  })
