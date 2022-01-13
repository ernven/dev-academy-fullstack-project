import { useState, useEffect } from 'react'
import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts'


function Chart({ farms }) {
  const [chartData, setChartData] = useState([])

  let url = ''

  useEffect(() => {
    fetch(url)
      .then(res => res.ok ? res.json() : console.log("Error fetching graph data."))
      .then(data => {
        const dataFormatted = data.map(i => { return {...i, date: (new Date(i.date)).toLocaleDateString()} })
        setChartData(dataFormatted)
      })
      .catch(err => console.log(err))


  }, [url])


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
    <LineChart width={800} height={400} data={chartData}
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
