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

const NoMatch = () => <Typography variant='h4'>404 - Not found</Typography>

function App() {
  const [farms, setFarms] = useState([])

  async function fetchFarms(signal?: AbortSignal) {
    const res = signal ? await fetch('farms', { signal: signal }) : await fetch('farms')
    
    const { data, error } = res.status === 200 ? await res.json() : null

    if (error) { console.log(error) }
    if (data) { setFarms(data) }
  }

  useEffect(() => {
    const abortController = new AbortController()
    fetchFarms(abortController.signal)

    return () => abortController.abort()    // cleanup
  }, [])

  return (
    <div id='app-container'>
      <BrowserRouter>
        <HeaderDrawer />
        <div id='route-elements'>
          <Routes>
            <Route path='/' element={Main()} />
            <Route path='admin' element={<AdminPage fetchFarms={fetchFarms} />} />
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
