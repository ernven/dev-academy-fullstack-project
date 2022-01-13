import { useState, useEffect } from 'react'
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material'

import Chart from './Chart'

export default function FilteredGraph({ farms }) {
  const [chartData, setChartData] = useState([])
  const [selected, setSelected] = useState('')

  // Fetch data only when the user chooses a type.
  // The data needs to be formatted in a certain way for the chart to display properly, so we do that here as well.
  useEffect(() => {
    if (selected) {
      fetch('data/filter?type=' + selected)
        .then(res => res.ok ? res.json() : console.log('Error fetching graph data.'))
        .then(data => {

          const dataFormatted = data.map(i => {
            return { date: (new Date(i.date)).toLocaleDateString(), [i.farm_name]: i.read_value }
          })

          setChartData(dataFormatted)
        })
        .catch(err => console.log(err))
    }
  }, [selected])

  // This function handles the setting of filters (via the request url).
  const changeFilter = type => setSelected(type)

  return (
    <div>
      <FormControl component='fieldset' sx={{marginLeft: '25%', paddingBottom: '1em'}} >
        <FormLabel component='legend'>Sensor Type</FormLabel>
        <RadioGroup
          row aria-label='sensor-type'
          name='row-radio-buttons-group'      
          value={selected}
          onChange={e => changeFilter(e.target.value)}  
        >
          <FormControlLabel value='pH' control={<Radio />} label='pH level' />
          <FormControlLabel value='rainFall' control={<Radio />} label='Rainfall' />
          <FormControlLabel value='temperature' control={<Radio />} label='Temperature' />
        </RadioGroup>
      </FormControl>

      <Chart farms={farms} chartData={chartData}/>
    </div>
  )
}
