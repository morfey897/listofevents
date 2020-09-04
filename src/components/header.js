import React, { useState, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles, AppBar, Menu, MenuItem, Toolbar, Container, IconButton, Hidden, ListItemIcon, ListItemText, Divider, Button, Drawer, List, ListItem } from '@material-ui/core';

import {
  Menu as MenuIcon,
  AddBox as AddEventIcon,
  TableChart as TableIcon,
  Room as MapIcon,
  Contacts as ContactsIcon,
  LabelImportant as AboutIcon,
  Person as AccountIcon,
  AssignmentInd as UserIcon,
  PersonAdd as CreateUserIcon,
  ExitToApp as LogoutIcon,
  Person as LoginIcon,
  ChevronLeft as ChevronLeftIcon,
} from '@material-ui/icons';

import { HOME, LIST_OF_EVENTS, EVENT_MAP, CONTACTS, ABOUT } from "../static/screens";

import { HEADER } from "../i18n";

const ACCOUNT_MENU_ID = 'primary-account-menu';
const MAIN_MENU_ID = 'primary-main-menu';

const drawerWidth = 240;
const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  menuItemIcon: {
    minWidth: theme.spacing(4)
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  drawerHeader: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  },
}));

function Header() {
  const classes = useStyles();

  const i18n = HEADER["ru"];

  const [accountMenuAnchor, setAnchorEl] = useState(null);
  const [mainMoreAnchorEl, setMainMoreAnchorEl] = useState(null);

  const isAccountMenuOpen = Boolean(accountMenuAnchor);
  const isMainMenuOpen = Boolean(mainMoreAnchorEl);

  const handleAccountMenuOpen = useCallback((event) => {
    setAnchorEl(event.currentTarget);
  }, []);

  const handleAccountMenuClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const handleMainMenuOpen = useCallback((event) => {
    setMainMoreAnchorEl(mainMoreAnchorEl ? null : event.currentTarget);
  }, [mainMoreAnchorEl]);

  const handleMainMenuClose = useCallback(() => {
    setMainMoreAnchorEl(null);
  }, []);

  const handleLogin = useCallback(() => {
    handleAccountMenuClose();
  }, []);

  const handleLogout = useCallback(() => {
    handleAccountMenuClose();
  }, []);

  const handleProfile = useCallback(() => {
    handleAccountMenuClose();
  }, []);

  const handleCreateAccount = useCallback(() => {
    handleAccountMenuClose();
  }, []);

  const handleCreateEvent = useCallback(() => {
    // setMobileMoreAnchorEl(null);
  }, []);

  return (
    <>
      <AppBar position="fixed" color="primary" className={classes.appBar}>
        <Container>
          <Toolbar disableGutters>
            <IconButton
              edge="start"
              color="inherit"
              className={classes.menuButton}
              aria-label={i18n.mainMenu}
              aria-controls={MAIN_MENU_ID}
              aria-haspopup="true"
              onClick={handleMainMenuOpen}>
              <MenuIcon />
            </IconButton>
            <Button variant="text" color="inherit" component={RouterLink} to={HOME}>
              {/* eslint-disable-next-line no-undef */}
              {process.env.APP_NAME}
            </Button>
            <div className={classes.grow} />

            {/* Main menu buttons */}
            <Hidden xsDown implementation="css">
              <IconButton aria-label={i18n.listOfEvents} color="inherit" component={RouterLink} to={LIST_OF_EVENTS}>
                <TableIcon />
              </IconButton>
              <IconButton aria-label={i18n.eventMap} color="inherit" component={RouterLink} to={EVENT_MAP}>
                <MapIcon />
              </IconButton>
              <IconButton aria-label={i18n.createEvent} color="inherit" onClick={handleCreateEvent}>
                <AddEventIcon />
              </IconButton>
            </Hidden>

            <IconButton
              edge="end"
              aria-label={i18n.account}
              aria-controls={ACCOUNT_MENU_ID}
              aria-haspopup="true"
              onClick={handleAccountMenuOpen}
              color="inherit"
            >
              <AccountIcon />
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
      {/* Profile menu */}
      <Menu
        anchorEl={accountMenuAnchor}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={ACCOUNT_MENU_ID}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isAccountMenuOpen}
        onClose={handleAccountMenuClose}
      >
        <MenuItem onClick={handleLogin} dense>
          <ListItemIcon className={classes.menuItemIcon}>
            <LoginIcon />
          </ListItemIcon>
          <ListItemText primary={i18n.login} />
        </MenuItem>
        <MenuItem onClick={handleCreateAccount} dense>
          <ListItemIcon className={classes.menuItemIcon}>
            <CreateUserIcon />
          </ListItemIcon>
          <ListItemText primary={i18n.createAccount} />
        </MenuItem>
        <MenuItem onClick={handleProfile} dense>
          <ListItemIcon className={classes.menuItemIcon}>
            <UserIcon />
          </ListItemIcon>
          <ListItemText primary={i18n.profile} />
        </MenuItem>
        <MenuItem onClick={handleLogout} dense>
          <ListItemIcon className={classes.menuItemIcon}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary={i18n.logout} />
        </MenuItem>
      </Menu>

      <Drawer
        className={classes.drawer}
        variant="temporary"
        classes={{
          paper: classes.drawerPaper,
        }}
        anchor={'left'}
        open={isMainMenuOpen}
        onClose={handleMainMenuClose}>
        <div className={classes.drawerContainer}>
          <div className={classes.drawerHeader}>
            <IconButton onClick={handleMainMenuClose}>
              <ChevronLeftIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            <ListItem button component={RouterLink} to={ABOUT} dense onClick={handleMainMenuClose}>
              <ListItemIcon className={classes.menuItemIcon}>
                <AboutIcon />
              </ListItemIcon>
              <ListItemText primary={i18n.about} />
            </ListItem>
            <Divider />
            <ListItem button component={RouterLink} to={LIST_OF_EVENTS} dense onClick={handleMainMenuClose}>
              <ListItemIcon className={classes.menuItemIcon}>
                <TableIcon />
              </ListItemIcon>
              <ListItemText primary={i18n.listOfEvents} />
            </ListItem>
            <ListItem button component={RouterLink} to={EVENT_MAP} dense onClick={handleMainMenuClose}>
              <ListItemIcon className={classes.menuItemIcon}>
                <MapIcon />
              </ListItemIcon>
              <ListItemText primary={i18n.eventMap} />
            </ListItem>
            <ListItem button onClick={handleCreateEvent} dense>
              <ListItemIcon className={classes.menuItemIcon}>
                <AddEventIcon />
              </ListItemIcon>
              <ListItemText primary={i18n.createEvent} />
            </ListItem>
            <Divider />
            <ListItem button component={RouterLink} to={CONTACTS} dense onClick={handleMainMenuClose}>
              <ListItemIcon className={classes.menuItemIcon}>
                <ContactsIcon />
              </ListItemIcon>
              <ListItemText primary={i18n.contacts} />
            </ListItem>
          </List>
        </div>
      </Drawer>
    </>
  );
}

export default Header;