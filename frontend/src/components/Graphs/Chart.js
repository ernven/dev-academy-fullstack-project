import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts'

export default function Chart({ farms, chartData }) {

  // This could be used to build lines in the future.
  const buildLines = farms => 
    farms.map(farm => 
      <Line
        key={farm.farm_name}
        type='monotone'
        name={farm.farm_name}
        dataKey={farm.farm_name}
        stroke={'#' + (Math.floor(100000 + Math.random() * 900000))}
      />
    )

  return (
    <LineChart width={900} height={450} data={chartData}>
      <CartesianGrid strokeDasharray='3 3' />
      <XAxis padding={{ left: 10, right: 10 }} dataKey='date' />
      <YAxis padding={{ top: 140, bottom: 30 }} />
      <Tooltip />
      <Legend />
      {buildLines(farms)}
    </LineChart>
  )
}
