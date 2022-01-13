import { Card, CardContent, Typography } from '@mui/material'

export default function DashboardCard({ data }) {
  const key = Object.keys(data)[1]

  return (
    <Card sx={{width: '14em', height: '13em', borderRadius: '1.2em'}}>
      <CardContent sx={{height: '35%', padding: '2em'}}>
        <Typography variant="h6">
          {key === 'rainFall' ? 'rainfall' : key}
        </Typography>
        <Typography variant="body2">
          Max: {data[key].max}
        </Typography>
        <Typography variant="body2">
          Average: {data[key].average}
        </Typography>
        <Typography variant="body2">
          Min: {data[key].min}
        </Typography>
      </CardContent>
    </Card>
  )
}
