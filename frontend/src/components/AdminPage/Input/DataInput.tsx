import { ChangeEvent, useState } from 'react'
import { Typography, Button, Input } from '@mui/material'

import './Input.css'

export default function DataInput() {
  const [file, setFile] = useState<File | null>(null)
  const [fileSelected, setFileSelected] = useState(false)

  // The status property set to 0 means n/a, 1 is success, 2 is error. Text field is for details.
  const [status, setStatus] = useState({ active: 0, text: '' })

  const submitData = () => {

    if (file?.type === 'text/csv') {
      const data = new FormData()
      data.append('file', file)

      const settings = {
        method: 'POST',
        body: data
      }

      fetch('data', settings)
        .then(res => res.status === 201 ? res.json() : res.json().then(r => setStatus({ active: 2, text: r.error.detail })))
        .then(data => data ? setStatus({ active: 1, text: 'Data was added to the database!' }) : null)
        .catch(err => setStatus({ active: 2, text: err }))

    } else {
      setStatus({ active: 2, text: 'Only .csv files are supported at the moment.' })
    }

    setFile(null)
    setFileSelected(false)
  }

  const handleFileAdd = (t: EventTarget & HTMLInputElement) => {
    if (t.files) {
      setFile(t.files[0])
      setFileSelected(true)
      setStatus({ active: 0, text: '' })
    }
  }

  const displayFileSize = () => {
    if (status.active === 1) {
      return <Typography color='green' >{status.text}</Typography>
    } else if (status.active === 2) {
      return <Typography color='red' >{status.text}</Typography>
    }
    if (fileSelected) {
      // @ts-ignore - We know the file won't be undefined in this scenario.
      return <Typography id='file-size-msg' >{Math.round(file.size / 1024.00) + ' KB'}</Typography>
    }
    return null
  }

  return (
    <div className='form-container'>
      
      <div id='file-input'>
        <Input
          disableUnderline={true}
          fullWidth
          type='file'
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleFileAdd(e.target)}
        />
        {displayFileSize()}
      </div>

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
