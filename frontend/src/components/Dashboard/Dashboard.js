// choose farm, display data. use fetch, have url update when farm is chosen.
import { useState } from 'react'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'

import DashboardCard from './DashboardCard'

export default function Dashboard({ farms }) {
  const [dashboardData, setDashboardData] = useState([])
  const [selected, setSelected] = useState('')

  // Fetching the data and formatting for the dashboard
  const getFarmData = async name => {
    let toInsert = []

    // Since we're sending requests to two endpoints, we need to chain them.
    const averages = await fetch('data/averages?name=' + name).then(res => res.ok ? res.json() : [])

    averages.forEach(i => toInsert.push({name: i.farm_name, [i.entry_type]: {average: i.average_value}}))

    const extremes = await fetch('data/extremes?name=' + name).then(res => res.ok ? res.json() : [])

    for (let i = 0; i < extremes.length; i++) {
      const obj = toInsert[i][extremes[i].entry_type]
      toInsert[i][extremes[i].entry_type] = {...obj, min: extremes[i].min_value, max: extremes[i].max_value}
    }

    setDashboardData(toInsert)
    setSelected(name)
  }

  const buildFarmList = () => {
    let items = []
    farms.forEach(farm => items.push(<MenuItem key={farm.farm_name} value={farm.farm_name} >{farm.farm_name}</MenuItem>))
    return items
  }

  const buildCards = () => {
    let items = []
    dashboardData.forEach(e => items.push(<DashboardCard key={Object.keys(e)[1]} data={e} />))
    return items
  }

  const dropdownMenu = () =>
    farms ?
      (<FormControl sx={{width: '50vw'}}>
        <InputLabel id='farms-label'>Farms</InputLabel>
        <Select
          labelId='farms-label'
          label='Farm'
          value={selected}
          onChange={e => getFarmData(e.target.value)}
        >
          {buildFarmList()}
        </Select>
      </FormControl>)
      : <div></div>

  return (
    <div>
      {dropdownMenu()}

      <div style={{display: 'flex', paddingTop: '5%'}} >
        {dashboardData ? buildCards() : null}
      </div>
          
    </div>
  )
}
