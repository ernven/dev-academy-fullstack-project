// text field with add farm button. file dropper with upload button.
// feedback if works or not
import { useState } from 'react'
import { Typography, TextField, Button } from '@mui/material'
import useFetch from '../../utils/useFetch'

export default function Admin() {
  const [farm, setFarm] = useState('')
  const [fetchParams, setFetchParams] = useState({url: '', })

  const { loading, data, error } = useFetch()

  const submitFarm = () => {
    const init = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: '{farm: ' + farm + '}',
    }

    setFetchParams({url: 'farm', params: init})
  }

  if (data) { console.log(data) }

  const submitData = () => {
    const init = {

    }
    setFetchParams({url: 'data', params: init})
  }

  return (
    <div style={{alignContent: 'space-around'}}>
      <Typography variant='h2' color='green' > Admin features</Typography>

      <div>
        <TextField value={farm} onChange={e => setFarm(e.target.value)} ></TextField>
        <Button onClick={submitFarm} >Add Farm</Button>
      </div>

      <div>
        <Button onClick={submitFarm} >Add Data</Button>
      </div>

    </div>
  )
}
