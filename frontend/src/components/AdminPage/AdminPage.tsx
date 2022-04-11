import { Typography } from '@mui/material'

import DataInput from './Input/DataInput'
import FarmInput from './Input/FarmInput'

interface propsType {
  fetchFarms: () => void
}

export default function Admin({ fetchFarms }: propsType) {
  return (
    <div>
      <Typography variant='h2' color='orange' >
        Admin features
      </Typography>

      <FarmInput fetchFarms={fetchFarms} />
      <DataInput />

    </div>
  )
}
