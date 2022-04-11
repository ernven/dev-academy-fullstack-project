export type Farm = {
  id: string,
  farm_name: string
}

export type DataEntry = {
  farm_name: string,
  date: string,
  entry_type: string,
  read_value: string
}

export type ComputedDataItem = {
  farm_name: string,
  entry_type: string,
  average_value?: string,
  max_value?: string,
  min_value?: string
}

export type DashboardData = {
  [key: string]: {
    average: string | undefined,
    max?: string | undefined,
    min?: string | undefined
  }
}

export type ChartDataEntry = {
  date: string,
  farm_name: string,
  read_value: string
}

export type HeaderPropTypes = {
  open: boolean,
  handleDrawerOpen?: () => void,
  handleDrawerClose?: () => void,
}

export type ErrorType = {
  code: string,
  detail: string
}
