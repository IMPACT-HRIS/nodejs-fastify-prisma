import parsePhoneNumber from 'libphonenumber-js'
import { REGEX_RFC_3339 } from '~/config/regex'

const isLeapYear = (year: number): boolean => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

export const validateDate = (dateString: string): boolean => {
  if (!REGEX_RFC_3339.test(dateString)) {
    return false
  }

  // Verify the correct number of days for
  // the month contained in the date-string.
  const year = Number(dateString.substr(0, 4))
  const month = Number(dateString.substr(5, 2))
  const day = Number(dateString.substr(8, 2))

  switch (month) {
    case 2: // February
      if (isLeapYear(year) && day > 29) {
        return false
      }
      if (!isLeapYear(year) && day > 28) {
        return false
      }
      return true
    case 4: // April
    case 6: // June
    case 9: // September
    case 11: // November
      if (day > 30) {
        return false
      }
      break
    default:
      break
  }

  return true
}

export const validatePhone = (phone: string): boolean => {
  if (!phone) return true
  const parsePhone = phone?.[0] === '+' ? phone.slice(1) : phone
  if (parsePhone === '' || Number.isNaN(Number(parsePhone))) return false
  const phoneNumber = parsePhoneNumber(String(phone), 'TH')
  return !!phoneNumber?.isValid()
}
