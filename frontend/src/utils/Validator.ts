function isValidFarmName(name: string) {
  return (name && !(/^\s*$/).test(name))
}

export { isValidFarmName }
