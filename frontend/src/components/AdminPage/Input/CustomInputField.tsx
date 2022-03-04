import { TextField } from '@mui/material'

// This component builds an input field which can display feedback to the user according to the status.
export default function CustomInputField({ farm, status, handleInputChange }) {
  if (!status.active) {
    return (
      <TextField
        fullWidth
        label='Farm Name'
        helperText='Please type the name for the new farm'
        value={farm}
        onChange={e => handleInputChange(e.target.value)}
      ></TextField>
    )
  } else if (status.active === 1) {
    return (
      <TextField
        color='success'
        focused
        fullWidth
        label='Farm Name'
        helperText={status.text}
        value={farm}
        onChange={e => handleInputChange(e.target.value)}
      ></TextField>
    )
  } else {
    return (
      <TextField
        error
        fullWidth
        label='Farm Name'
        helperText={status.text}
        value={farm}
        onChange={e => handleInputChange(e.target.value)}
      ></TextField>
    )
  }
}
