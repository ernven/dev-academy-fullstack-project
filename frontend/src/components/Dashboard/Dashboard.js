// choose farm, display data. use fetch, have url update when farm is chosen.
import { useState } from 'react'
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import useFetch from '../../utils/useFetch'

export default function Dashboard({ farms }) {
  const [data, setData] = useState([])
  const [selected, setSelected] = useState('')

  const buildFarmList = () => {
    let items = []

    farms.forEach(farm => items.push(<MenuItem key={farm.farm_name} value={farm.farm_name} >{farm.farm_name}</MenuItem>))

    return items
  }

  if (selected !== '') {
    const { data } = useFetch('data')
  }

  const dropdownMenu = () =>
    farms ?
      (<FormControl sx={{width: '50vw'}}>
        <InputLabel id='farms-label'>Farms</InputLabel>
        <Select
          labelId='farms-label'
          label='Farm'
          value={selected}
          onChange={e => setSelected(e.target.value)}
        >
          {buildFarmList()}
        </Select>
      </FormControl>)
      : <div></div>

  return (
    <div>
      {dropdownMenu()}
          
    </div>
  )
}
