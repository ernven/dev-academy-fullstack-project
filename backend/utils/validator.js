export const isFarmNameValid = farmName => (farmName && typeof farmName === 'string')

export const isValidDate = date => date

const isValidType = type => type && (type === 'pH' || type === 'rainFall' || type === 'temperature')

const isValueValid = (type, value) => {
  try {
    const parsedValue = parseFloat(value)
    return (
      type === 'pH' && (parsedValue >= 0.0 && parsedValue <= 14.0) ||
      type === 'rainFall' && (parsedValue >= 0.0 && parsedValue <= 500.0) ||
      type === 'temperature' && (parsedValue >= -50.0 && parsedValue <= 100.0)
    )
  } catch {
    return false
  }
}

export const isEntryValid = entry => (
  isFarmNameValid(entry.farmName) &&
  isValidDate(entry.date) &&
  isValidType(entry.type) &&
  isValueValid(entry.value)
)
