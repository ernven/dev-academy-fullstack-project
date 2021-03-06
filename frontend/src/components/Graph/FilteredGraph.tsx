import { useState, useEffect } from 'react'
import { Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material'

import Chart from './Chart'
import type { ChartDataEntry, Farm } from '../../utils/Types'

// Currently shows the data for 2020. This could be made customizable with a date picker, for example.
const apiUrl = 'data/chart-format?startDate=2020-01-01&endDate=2020-12-31&type=' 

// This component will pass data to the chart one to draw a graph of daily averages for the year 2020.
// The data is by farm and based on a certain type, chosen by the user (via the UI).
// In the future, time span could also be customized, as well as which farms should the data be shown for.
export default function FilteredGraph({ farms }: { farms: Farm[] }) {
  const [chartData, setChartData] = useState<any[]>([])
  const [selected, setSelected] = useState('')

  // Fetch data only when the user chooses a type.
  // The chart component expects data in a very particular way. For more info see: recharts.org
  // The data is formatted once received.
  // (during this process we use an endpoint which returns only what we need, minimizing load and improving performance)
  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch(apiUrl + selected)

      const bodyParsed =  await res.json()

      res.status === 200 ? handleData(bodyParsed) : console.log(bodyParsed)
    }

    if (selected) {
      fetchData()
    }
  }, [selected])

  const handleData = (data: ChartDataEntry[]) => {
    let dataReady: any[] = []

    data.forEach(i => {
      const itemDate = (new Date(i.date)).toLocaleDateString()
      const lastIndex = dataReady.length - 1
      const parsedValue = parseFloat(i.read_value)

      if (isNaN(parsedValue)) { return }

      // If the array doesnt contain an object with the date, we need to add it (plus the data of the item).
      // If it does, new data should be added to that object, so we have to check that.
      if (lastIndex > -1 && dataReady[lastIndex].date === itemDate) {

        // If a value exists for the farm, we calculate the average (since it's what we display).
        if (dataReady[lastIndex][i.farm_name]) {
          const previousVal = dataReady[lastIndex][i.farm_name]
          dataReady[lastIndex][i.farm_name] = Math.round((((previousVal + parsedValue) / 2.0) * 100) / 100)
        } else {
          dataReady[lastIndex] = {...dataReady[lastIndex], [i.farm_name]: parsedValue}
        }

      } else {
        dataReady.push({ date: itemDate, [i.farm_name]: parsedValue })
      }
    })
    setChartData(dataReady)
  }

  const changeFilter = (type: string) => setSelected(type)

  return (
    <div>
      <Typography variant='h5' sx={{marginLeft: '6%'}} color='orange'>
        Year 2020 data: daily averages
        </Typography>

      <FormControl component='fieldset' sx={{marginLeft: '30%'}} >
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
