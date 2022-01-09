const isValidFarmId = farm_id => (farm_id && typeof farm_id === 'string')

// The two following -helper- functions are just for checking date values.
const areValidDateValues = (year, month, day) => {
  if (month < 1 || month > 12 || day < 1 || day > 31) { return false }
  if ([4,6,9,11].includes(month) && day > 30) { return false }
  if (month === 2) {
    // Checking for leap years.
    if ((year % 4 === 0) && (year % 100 !== 0 || year % 400 === 0)) {
      return (day < 30)
    } else {
      return (day < 29)
    }
  }
  return true
}

const areValidTimeValues = (hour, minutes, seconds) =>
  (hour >= 0 && hour < 24) && (minutes > 0 && minutes < 60) && (seconds > 0 && seconds < 60 )

// This functions, using the previous two, checks the date format plus values.
const isValidDate = date => {

  const testRegex = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}\.?\d{0,3}(Z|([+-]\d{2}:\d{2})?))?$/

  // Checking if the input matches the expected format.
  if (!date.match(testRegex)) { return false }

  const inputDate = new Date(date)
  const now = new Date()

  // Checking if the date is in the future.
  if (inputDate > now) { return false }

  // Check if the values are valid.
  const year = parseInt(date.substring(0,4))
  const month = parseInt(date.substring(5,7))
  const day = parseInt(date.substring(8,10))

  if (!areValidDateValues(year, month, day)) { return false }

  if (date.length >= 19) {
    const hour = parseInt(date.substring(11,13))
    const minutes = parseInt(date.substring(14,16))
    const seconds = parseInt(date.substring(17,19))

    return areValidTimeValues(hour, minutes, seconds)
  }

  return true
}

const isValidType = entry_type =>
  entry_type && (entry_type === 'pH' || entry_type === 'rainFall' || entry_type === 'temperature')

const isValidValue = (entry_type, read_value) => {
  try {
    const parsedValue = parseFloat(read_value)
    return (
      entry_type === 'pH' && (parsedValue >= 0.0 && parsedValue <= 14.0) ||
      entry_type === 'rainFall' && (parsedValue >= 0.0 && parsedValue <= 500.0) ||
      entry_type === 'temperature' && (parsedValue >= -50.0 && parsedValue <= 100.0)
    )
  } catch {
    return false
  }
}

export const isValidQuery = params => {
  if (params.startDate) {
    if (!isValidDate(params.startDate)) { return false }
  }
  if (params.endDate) {
    if (!isValidDate(params.endDate)) { return false }
  }
  if (params.type) {
    if (!isValidType(params.type)) { return false }
  }
  return true
}

export const isValidEntry = entry => (
  isValidFarmId(entry.farm_id) &&
  isValidDate(entry.date) &&
  isValidType(entry.entry_type) &&
  isValidValue(entry.entry_type, entry.read_value)
)
