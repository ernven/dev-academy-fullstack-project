function isValidFarmName(name) {
  return (name && !(/^\s*$/).test(name))
}

export { isValidFarmName }
