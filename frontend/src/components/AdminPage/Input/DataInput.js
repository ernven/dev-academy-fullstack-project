import { useState } from 'react'
import { Typography, Button, Input } from '@mui/material'

import './Input.css'

export default function DataInput() {
  const [file, setFile] = useState(null)
  const [fileSelected, setFileSelected] = useState(false)

  // This state stores the status of the user's operation.
  // in the active field, 0 means n/a, 1 is success, 2 is error. Text field is for details.
  const [status, setStatus] = useState({ active: 0, text: '' })

  const submitData = () => {

    // check file extension here
    if (file.type === 'text/csv') {
      const data = new FormData()
      data.append('file', file)

      const settings = {
        method: 'POST',
        body: data
      }

      // We send the POST request to the backend.
      fetch('data', settings)
        .then(res => res.ok ? res.json() : res.json().then(r => setStatus({ active: 2, text: r.error.detail })))
        .then(data => data ? setStatus({ active: 1, text: 'Data was added to the database!' }) : null)
        .catch(err => setStatus({ active: 2, text: err }))

    } else {
      setStatus({ active: 2, text: 'Only .csv files are supported at the moment.' })
    }

    setFile(null)
    setFileSelected(false)
  }

  const handleFileAdd = t => {
    setFile(t.files[0])
    setFileSelected(true)
    setStatus({ active: 0, text: '' })
  }

  const displayFileSize = () => {
    if (status.active === 1) {
      return <Typography className='file-status-msg' color='green' >{status.text}</Typography>
    } else if (status.active === 2) {
      return <Typography className='file-status-msg' color='red' >{status.text}</Typography>
    }
    if (fileSelected) {
      return <Typography className='file-status-msg' >{Math.round(file.size / 1024.00) + ' KB'}</Typography>
    }
  }

  return (
    <div className='form-container'>
        <Input
          id='file-input'
          disableUnderline={true}
          fullWidth
          type='file'
          onChange={e => handleFileAdd(e.target)}
        />
        {displayFileSize()}
        <Button
          className='submit-button'
          disabled={!fileSelected}
          onClick={submitData}
        >
          Add Data
        </Button>
      </div>
  )
}
