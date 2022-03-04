import { Card, CardContent, Typography } from '@mui/material'

export default function DashboardCard({ data }) {
  const key = Object.keys(data)[1]

  return (
    <Card sx={{width: '14em', height: '13em', margin: '1.5%', borderRadius: '1.2em', backgroundColor: 'tan'}}>
      <CardContent sx={{height: '35%', padding: '2em', color: 'darkgreen'}}>
        <Typography variant="h5" sx={{marginBottom: '1em'}}>
          {key === 'rainFall' ? 'rainfall' : key}
        </Typography>
        <Typography variant="body1">
          Max: {data[key].max}
        </Typography>
        <Typography variant="body1">
          Average: {data[key].average}
        </Typography>
        <Typography variant="body1">
          Min: {data[key].min}
        </Typography>
      </CardContent>
    </Card>
  )
}
