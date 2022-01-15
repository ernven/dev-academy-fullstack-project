import { Typography } from '@mui/material'

import DataInput from './Input/DataInput'
import FarmInput from './Input/FarmInput'

export default function Admin() {
  return (
    <div style={{marginLeft: '20vw'}}>
      <Typography variant='h2' color='orange' >
        Admin features
      </Typography>

      <FarmInput />
      <DataInput />

    </div>
  )
}
