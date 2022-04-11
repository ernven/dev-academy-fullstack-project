// choose farm, display data. use fetch, have url update when farm is chosen.
import { useState } from 'react'
import { FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material'

import DashboardCard from './DashboardCard'
import type { Farm, ComputedDataItem, DashboardData } from '../../utils/Types'

import './Dashboard.css'

export default function Dashboard({ farms }: { farms: Farm[] }) {
  const [dashboardData, setDashboardData] = useState<DashboardData[]>([])
  const [selected, setSelected] = useState('')

  const populateDashboardData = async (name: string) => {

    const averages = await fetch('data/averages?name=' + name).then(res => res.status === 200 ? res.json() : [])

    const extremes = await fetch('data/extremes?name=' + name).then(res => res.status === 200 ? res.json() : [])

    const data = formatData(averages, extremes)

    setDashboardData(data)
    setSelected(name)
  }

  const formatData = (averages: ComputedDataItem[], extremes: ComputedDataItem[]) => {
    let formattedData: DashboardData[] = []

    averages.forEach(i => formattedData.push({ [i.entry_type]: { average: i.average_value } }))

    for (let i = 0; i < extremes.length; i++) {
      const obj = formattedData[i][extremes[i].entry_type]

      formattedData[i][extremes[i].entry_type] = {...obj, min: extremes[i].min_value, max: extremes[i].max_value}
    }

    return formattedData
  }

  const buildList = () => farms ?
    farms.map(farm => (<MenuItem key={farm.farm_name} value={farm.farm_name} >{farm.farm_name}</MenuItem>))
    : null

  const buildCards = () => 
    dashboardData.map(e => (<DashboardCard key={Object.keys(e)[1]} data={e} />))

  return (
    <div id='container'>
      <FormControl className='dropdown-menu'>
        <InputLabel id='farms-label'>Farms</InputLabel>
        <Select
          labelId='farms-label'
          label='Farm'
          value={selected}
          onChange={e => populateDashboardData(e.target.value)}
        >
          {buildList()}
        </Select>
      </FormControl>

      <div id='cards-container' >
        {selected ? buildCards() :
          <Typography className='dropdown-menu' variant='subtitle1'>Please select a farm to show data.</Typography>}
      </div>
          
    </div>
  )
}
