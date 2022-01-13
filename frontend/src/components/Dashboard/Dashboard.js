// choose farm, display data. use fetch, have url update when farm is chosen.
import { useState } from 'react'
import { FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material'

import DashboardCard from './DashboardCard'

import './Dashboard.css'

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

  // This function builds a lit of menu items containing the farms's names.
  const buildList = () => 
    farms.map(farm => (<MenuItem key={farm.farm_name} value={farm.farm_name} >{farm.farm_name}</MenuItem>))

  // This function builds the cards to be displayed on the dashboard.
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
          onChange={e => getFarmData(e.target.value)}
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
