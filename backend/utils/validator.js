export const farmNameValidator = farmName => (farmName && typeof farmName === 'string')

export const dateValidator = date => date

const typeValidator = type => type && (type === 'pH' || type === 'rainFall' || type === 'temperature')

const valueValidator = (type, value) => {
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

export const entryValidator = entry => (
  farmNameValidator(entry.farmName) &&
  dateValidator(entry.date) &&
  typeValidator(entry.type) &&
  valueValidator(entry.value)
)
