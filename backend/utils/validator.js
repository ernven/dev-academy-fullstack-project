const isValidFarmId = farm_id => (farm_id && typeof farm_id === 'string')

// NEEDS TO BE FIXED!!
const isValidDate = date => true

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
