import { useState } from 'react'
import { Button } from '@mui/material'

import CustomInputField from './CustomInputField'
import { isValidFarmName } from '../../../utils/Validator'

import './Input.css'

export default function FarmInput() {
  const [farm, setFarm] = useState('')

  // This state stores the status of the user's operation.
  // in the active field, 0 means n/a, 1 is success, 2 is error. Text field is for details.
  const [status, setStatus] = useState({ active: 0, text: '' })

  const submitFarm = () => {
    if (isValidFarmName(farm)) {
      // If the entry is valid, we can try to add it.

      const settings = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', },
        body: `{"farm_name":"` + farm + `"}`,
      }

      // We send the POST request to the backend.
      fetch(process.env.REACT_APP_API_URL + 'farms', settings)
        .then(res =>
          res.ok
            ? res.json()
            : res.json().then(r =>
              r.error.code === '23505'
                ? setStatus({ active: 2, text: 'Farm "' + farm + '" already exists in the database.' })
                : setStatus({ active: 2, text: r.error.detail })
            )
          )
        .then(data =>
          data && data.status === 'success'
            ? setStatus({ active: 1, text: farm + ' was added to the database!' })
            : null
        )
        .catch(err => setStatus({ active: 2, text: err }))

    } else {
      // If data is invalid, show an error.
      setStatus({active: 2, text: 'Farm names cannot be empty or blank.'})
    }
  }

  const handleInputChange = value => {
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
