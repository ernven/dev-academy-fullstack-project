export type row = {
  farm_id: string,
  date: string,
  entry_type: string,
  read_value: string
}

export type parameters =  {
  name?: string | string[],
  type?: string | string[],
  startDate?: string,
  endDate?: string
}
