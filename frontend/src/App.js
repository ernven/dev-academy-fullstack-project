import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Typography } from '@mui/material'

import HeaderDrawer from './components/HeaderDrawer/HeaderDrawer'
import FilteredTable from './components/FilteredTable/Table/DataTable'
import Graph from './components/Graphs/Chart'

import './App.css'

const Main = () => <Typography variant='h3' color='green'>Welcome to the Farms App!</Typography>

// Any non matching routes will show a 404 error.
const NoMatch = () => <Typography variant='h4'>404 - Not found</Typography>

function App() {
  const [farms, setFarms] = useState([])
  const [data, setData] = useState([])

  useEffect(() => 
    Promise.all([
      fetch('/farms')
        .then(res => res.status === 200 ? res.json() : console.log(res)),
      fetch('/data')
        .then(res => res.status === 200 ? res.json() : console.log(res))
    ])
      .then(([farms, farmData]) => {
        if (farms) { setFarms(farms) }
        if (farmData) { setData(farmData) }
      })
      .catch(err => console.log(err))
  , [])

  return (
    <div style={{ display: 'flex' }}>
      <BrowserRouter>
        <HeaderDrawer />
        <div id='route-elements'>
          <Routes>
            <Route path='/' element={Main()} />
            <Route path='table' element={<FilteredTable farms={farms} data={data} />} />
            <Route path='graph' element={<Graph farms={farms} data={data} />} />
            <Route path='*' element={NoMatch()} />
          </Routes>
        </div>
    </BrowserRouter>
    </div>
  )
}

export default App
