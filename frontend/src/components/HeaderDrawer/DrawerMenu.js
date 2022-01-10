import { useNavigate } from 'react-router-dom'
import { IconButton, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material'
import MuiDrawer from '@mui/material/Drawer'
import { styled, useTheme } from '@mui/material/styles'

import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import TableRowsIcon from '@mui/icons-material/TableRows'
import ShowChartIcon from '@mui/icons-material/ShowChart'
import DashboardIcon from '@mui/icons-material/Dashboard'

const drawerWidth = 240

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
})

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(9)} + 1px)`,
  },
})

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
)

export default function DrawerMenu({ open, handleDrawerClose }) {
  const theme = useTheme()
  const navigate = useNavigate()

  return (
    <Drawer variant='permanent' open={open}>

      <DrawerHeader>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>

      <Divider />

      <List>

        <ListItem button key='Manage' onClick={() => navigate('/admin')} >
          <ListItemIcon>
            <ManageAccountsIcon />
          </ListItemIcon>
          <ListItemText primary='Manage' />
        </ListItem>

      </List>

      <Divider />

    <List>

        <ListItem button key='Table View' onClick={(e) => navigate('/table')}>
          <ListItemIcon>
            <TableRowsIcon />
          </ListItemIcon>
          <ListItemText primary='Table View' />
        </ListItem>

        <ListItem button key='Graph View' onClick={() => navigate('/graph')} >
          <ListItemIcon>
            <ShowChartIcon />
          </ListItemIcon>
          <ListItemText primary='Graph View' />
        </ListItem>

        <ListItem button key='Dashboard' onClick={() => navigate('/dashboard')}  >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary='Dashboard' />
        </ListItem>

      </List>

    </Drawer>
  )
}
