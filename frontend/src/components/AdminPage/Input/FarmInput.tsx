import { useState } from 'react'
import { Button } from '@mui/material'

import CustomInputField from './CustomInputField'
import { isValidFarmName } from '../../../utils/Validator'
import type { ErrorType } from '../../../utils/Types'

import './Input.css'

interface propsType {
  fetchFarms: () => void
}

export default function FarmInput({ fetchFarms }: propsType) {
  const [farm, setFarm] = useState('')

  // The active property set to 0 means n/a, 1 is success, 2 is error. Text field is for details.
  const [status, setStatus] = useState({ active: 0, text: '' })

  const submitFarm = () => {
    if (!isValidFarmName(farm)) {
      setStatus({active: 2, text: 'Farm names cannot be empty or blank.'})
    }

    const settings = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', },
      body: `{"farm_name":"` + farm + `"}`,
    }

    fetch('farms', settings)
      .then(res =>
        res.status === 201
          ? res.json()
          : res.json().then(r => handlePostError(r.error))
        )
      .then(data => handlePostData(data))
      .catch(err => handlePostError(err))
  }

  const handlePostData = (data: { status: string }) => {
    if (data && data.status === 'success') {
      setStatus({ active: 1, text: farm + ' was added to the database!' })
      fetchFarms()
    }
  }

  const handlePostError = (error: ErrorType) => {
    if (error.code === '23505') {
      setStatus({ active: 2, text: 'Farm "' + farm + '" already exists in the database.' })
    } else if (error.detail) {
      setStatus({ active: 2, text: error.detail })
    } else {
      setStatus({ active: 2, text: JSON.stringify(error) })
    }
  }

  const handleInputChange = (value: string) => {
    setFarm(value)
    if (status.active) { setStatus({ active: 0, text: '' }) }
  }

  return (
    <div className='form-container'>
      <CustomInputField farm={farm} status={status} handleInputChange={handleInputChange} />
      <Button
        className='submit-button'
        onClick={submitFarm}
      >
        Add Farm
      </Button>
    </div>
  )
}
