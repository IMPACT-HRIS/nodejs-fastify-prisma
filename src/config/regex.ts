export const REGEX_PASSWORD = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])[a-zA-Z0-9 !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]*$/
export const REGEX_COLOR = /^(?:#|0x)(?:[a-f0-9]{3}|[a-f0-9]{6}|[a-f0-9]{8})\b|(?:rgb|hsl)a?\([^)]*\)$/
export const REGEX_RFC_3339 = /^(\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01]))$/
export const REGEX_TIME = /^([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9])(\.[0-9]{1,3})?$/
export const REGEX_INT = /^[-+]?[0-9]+$/
export const REGEX_NONNEGATIVE_INT = /^[0-9]+$/
export const REGEX_TIME_STAMP = /^(\d{13})?$/
