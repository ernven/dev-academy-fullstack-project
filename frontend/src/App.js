import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Typography } from '@mui/material'

import HeaderDrawer from './components/HeaderDrawer/HeaderDrawer'
import DataGrid from './components/DataGrid/DataGrid'
import FilteredGraph from './components/Graph/FilteredGraph'
import AdminPage from './components/AdminPage/AdminPage'
import Dashboard from './components/Dashboard/Dashboard'

import './App.css'

const Main = () => <Typography variant='h3' color='orange'>Welcome to the Farms App!</Typography>

// Any non matching routes will show a 404 error.
const NoMatch = () => <Typography variant='h4'>404 - Not found</Typography>

function App() {
  const [farms, setFarms] = useState([])

  // At first render, we fetch the list of farms to pass on to other components.
  useEffect(() => 
    fetch('farms')
      .then(res => res.status === 200 ? res.json() : null)
      .then(data => setFarms(data))
      .catch(err => console.log(err))
  , [])

  return (
    <div style={{ display: 'flex' }}>
      <BrowserRouter>
        <HeaderDrawer />
        <div id='route-elements'>
          <Routes>
            <Route path='/' element={Main()} />
            <Route path='admin' element={<AdminPage />} />
            <Route path='table' element={<DataGrid />} />
            <Route path='graph' element={<FilteredGraph farms={farms} />} />
            <Route path='dashboard' element={<Dashboard farms={farms} />} />
            <Route path='*' element={NoMatch()} />
          </Routes>
        </div>
    </BrowserRouter>
    </div>
  )
}

export default App
