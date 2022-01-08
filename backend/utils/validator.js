const isValidFarmId = farm_id => (farm_id && typeof farm_id === 'string')

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

export const isValidFarmName = farm_name => (farm_name && typeof farm_name === 'string')

export const isValidDate = date => true

export const isValidType = entry_type =>
  entry_type && (entry_type === 'pH' || entry_type === 'rainFall' || entry_type === 'temperature')

export const isValidEntry = entry => (
  isValidFarmId(entry.farm_id) &&
  isValidDate(entry.date) &&
  isValidType(entry.entry_type) &&
  isValidValue(entry.entry_type, entry.read_value)
)
