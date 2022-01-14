import { LineChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Line } from 'recharts'

export default function Chart({ farms, chartData }) {

  // This could be used to build lines in the future.
  const buildLines = farms => farms ?
    farms.map(farm => 
      <Line
        key={farm.farm_name}
        name={farm.farm_name}
        dataKey={farm.farm_name}
        dot={false}
        type='monotone'
        stroke={'#' + (Math.floor(100000 + Math.random() * 900000))}
      />
    ) : null

  return (
    <LineChart width={900} height={450} data={chartData}>
      <CartesianGrid strokeDasharray='3 3' />
      <XAxis dataKey='date' />
      <YAxis />
      <Tooltip />
      <Legend />
      {buildLines(farms)}
    </LineChart>
  )
}
