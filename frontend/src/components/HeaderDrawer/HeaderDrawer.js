import { useState } from 'react'

import Header from './Header'
import DrawerMenu from './DrawerMenu'

export default function HeaderDrawer() {
  const [open, setOpen] = useState(false)

  const handleDrawerOpen = () => setOpen(true)

  const handleDrawerClose = () => setOpen(false)

  return (
    <div>
      <Header open={open} handleDrawerOpen={handleDrawerOpen} />
      <DrawerMenu open={open} handleDrawerClose={handleDrawerClose} />
    </div>
  )
}
