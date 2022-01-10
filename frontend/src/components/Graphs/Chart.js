import { useState, useEffect } from 'react'
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts'

import useFetch from '../../utils/useFetch'

function Chart({ farms }) {
  const [data, setData] = useState([])

  const response = useFetch('data')

  useEffect(() => {
    if (response.data) { setData(response.data) }
  }, [response.data])

  const prepareData = data.map(i => { return {...i, date: (new Date(i.date)).toLocaleDateString()} })

  // This could be used to build lines in the future.
  const buildLine = type => (
    <Line
      type='monotone'
      name={type}
      dataKey={i => i.entry_type === type ? i.read_value : null}
      stroke='#1810d8' 
    />
  )

  return (
    <LineChart width={800} height={400} data={prepareData}
      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
      <CartesianGrid strokeDasharray='3 3' />
      <XAxis dataKey='date' />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line
        type='monotone'
        name='pH'
        dataKey={i => i.entry_type === 'ph' ? i.read_value : null}
        stroke='#f9141e'
      />
      <Line
        type='monotone'
        name='Rainfall'
        dataKey={i => i.entry_type === 'rainFall' ? i.read_value : null}
        stroke='#586618'
      />
      <Line
        type='monotone'
        name='Temperature'
        dataKey={i => i.entry_type === 'temperature' ? i.read_value : null}
        stroke='#1810d8' 
      />
    </LineChart>
  )
}

export default Chart
