import { Toolbar, IconButton, Typography } from '@mui/material'
import MuiAppBar from '@mui/material/AppBar'
import { styled } from '@mui/material/styles'

import MenuIcon from '@mui/icons-material/Menu'

const drawerWidth = 240

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}))

export default function Header({ open, handleDrawerOpen }) {
  return (
    <AppBar position='fixed' color='default' open={open}>
      <Toolbar>
        <IconButton
          color='inherit'
          aria-label='open drawer'
          onClick={handleDrawerOpen}
          edge='start'
          sx={{ marginRight: '36px', ...(open && { display: 'none' }), }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant='h5' color='green' noWrap component='div'>
          Farms App
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
