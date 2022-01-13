import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Typography } from '@mui/material'

import useFetch from './utils/useFetch'
import HeaderDrawer from './components/HeaderDrawer/HeaderDrawer'
import DataGrid from './components/DataTable/DataGrid'

import Graph from './components/Graphs/Chart'
import AdminPage from './components/AdminPage/AdminPage'
import Dashboard from './components/Dashboard/Dashboard'

import './App.css'

const Main = () => <Typography variant='h3' color='green'>Welcome to the Farms App!</Typography>

// Any non matching routes will show a 404 error.
const NoMatch = () => <Typography variant='h4'>404 - Not found</Typography>

function App() {
  const [farms, setFarms] = useState([])

  const response = useFetch('farms')

  useEffect(() => {
    if (response.data) { setFarms(response.data) }
  }, [response.data])

  return (
    <div style={{ display: 'flex' }}>
      <BrowserRouter>
        <HeaderDrawer />
        <div id='route-elements'>
          <Routes>
            <Route path='/' element={Main()} />
            <Route path='admin' element={<AdminPage />} />
            <Route path='table' element={<DataGrid />} />
            <Route path='graph' element={<Graph farms={farms} />} />
            <Route path='dashboard' element={<Dashboard farms={farms} />} />
            <Route path='*' element={NoMatch()} />
          </Routes>
        </div>
    </BrowserRouter>
    </div>
  )
}

export default App
