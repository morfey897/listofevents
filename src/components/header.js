import React, { useState, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles, AppBar, Menu, MenuItem, Toolbar, Container, IconButton, Hidden, ListItemIcon, ListItemText, Divider, Button, Drawer, List, ListItem, useTheme } from '@material-ui/core';

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
  Brightness7 as DarkThemeIcon,
  Brightness4 as LightThemeIcon,
} from '@material-ui/icons';

import { SCREENS, DIALOGS, EVENTS } from "../enums";

import { DialogEmitter, ThemeEmitter } from '../emitters';
import { useTranslation } from 'react-i18next';

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
  const theme = useTheme();
  const classes = useStyles();

  const {t} = useTranslation("header");

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
    DialogEmitter.open(DIALOGS.ADD_EVENT);
  }, []);

  const handleChangeTheme = useCallback(() => {
    ThemeEmitter.emit(EVENTS.UI_DARK_MODE);
  }, []);

  return (
    <>
      <AppBar position="fixed" className={classes.appBar}>
        <Container>
          <Toolbar disableGutters>
            <IconButton
              edge="start"
              color="inherit"
              className={classes.menuButton}
              aria-label={t("main-menu")}
              aria-controls={MAIN_MENU_ID}
              aria-haspopup="true"
              onClick={handleMainMenuOpen}>
              <MenuIcon />
            </IconButton>
            <Button variant="text" color="inherit" component={RouterLink} to={SCREENS.HOME}>
              {process.env.APP_NAME}
            </Button>
            <div className={classes.grow} />

            <IconButton aria-label={t("toggle-theme")} color="inherit" onClick={handleChangeTheme}>
                {(theme.palette.type === "dark") ? <DarkThemeIcon /> : <LightThemeIcon />}
              </IconButton>
              
            {/* Main menu buttons */}
            <Hidden xsDown implementation="css">
              <IconButton aria-label={t("list-of-events")} color="inherit" component={RouterLink} to={SCREENS.LIST_OF_EVENTS}>
                <TableIcon />
              </IconButton>
              <IconButton aria-label={t("event-map")} color="inherit" component={RouterLink} to={SCREENS.EVENT_MAP}>
                <MapIcon />
              </IconButton>
              <IconButton aria-label={t("create-event")} color="inherit" onClick={handleCreateEvent}>
                <AddEventIcon />
              </IconButton>
            </Hidden>

            <IconButton
              edge="end"
              aria-label={t("account")}
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
          <ListItemText primary={t("login")} />
        </MenuItem>
        <MenuItem onClick={handleCreateAccount} dense>
          <ListItemIcon className={classes.menuItemIcon}>
            <CreateUserIcon />
          </ListItemIcon>
          <ListItemText primary={t("create-account")} />
        </MenuItem>
        <MenuItem onClick={handleProfile} dense>
          <ListItemIcon className={classes.menuItemIcon}>
            <UserIcon />
          </ListItemIcon>
          <ListItemText primary={t("profile")} />
        </MenuItem>
        <MenuItem onClick={handleLogout} dense>
          <ListItemIcon className={classes.menuItemIcon}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary={t("logout")} />
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
            <ListItem button component={RouterLink} to={SCREENS.ABOUT} dense onClick={handleMainMenuClose}>
              <ListItemIcon className={classes.menuItemIcon}>
                <AboutIcon />
              </ListItemIcon>
              <ListItemText primary={t("about")} />
            </ListItem>
            <Divider />
            <ListItem button component={RouterLink} to={SCREENS.LIST_OF_EVENTS} dense onClick={handleMainMenuClose}>
              <ListItemIcon className={classes.menuItemIcon}>
                <TableIcon />
              </ListItemIcon>
              <ListItemText primary={t("list-of-events")} />
            </ListItem>
            <ListItem button component={RouterLink} to={SCREENS.EVENT_MAP} dense onClick={handleMainMenuClose}>
              <ListItemIcon className={classes.menuItemIcon}>
                <MapIcon />
              </ListItemIcon>
              <ListItemText primary={t("event-map")} />
            </ListItem>
            <ListItem button onClick={() => {handleMainMenuClose(); handleCreateEvent();}} dense>
              <ListItemIcon className={classes.menuItemIcon}>
                <AddEventIcon />
              </ListItemIcon>
              <ListItemText primary={t("create-event")} />
            </ListItem>
            <Divider />
            <ListItem button component={RouterLink} to={SCREENS.CONTACTS} dense onClick={handleMainMenuClose}>
              <ListItemIcon className={classes.menuItemIcon}>
                <ContactsIcon />
              </ListItemIcon>
              <ListItemText primary={t("contacts")} />
            </ListItem>
          </List>
        </div>
      </Drawer>
    </>
  );
}

export default Header;