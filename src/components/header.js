import React, { useState, useCallback } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { makeStyles, AppBar, Menu, MenuItem, Toolbar, Container, IconButton, Hidden, ListItemIcon, ListItemText, Divider, Button, Drawer, List, ListItem, useTheme, Tooltip } from '@material-ui/core';

import {
  Menu as MenuIcon,
  AddBox as AddEventIcon,
  TableChart as TableIcon,
  Room as MapIcon,
  Contacts as ContactsIcon,
  LabelImportant as AboutIcon,
  Person as GuestIcon,
  AccountBox as AccountIcon,
  AssignmentInd as UserIcon,
  PersonAdd as CreateUserIcon,
  ExitToApp as LogoutIcon,
  Person as LoginIcon,
  ChevronLeft as ChevronLeftIcon,
  Brightness7 as LightThemeIcon,
  Brightness3 as DarkThemeIcon,
  ViewDay,
} from '@material-ui/icons';

import { SCREENS, DIALOGS, EVENTS } from "../enums";

import { DialogEmitter, ThemeEmitter } from '../emitters';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

const ACCOUNT_MENU_ID = 'primary-account-menu';
const MAIN_MENU_ID = 'primary-main_menu';

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

function Header({ isLogged }) {
  const theme = useTheme();
  const classes = useStyles();

  const { t } = useTranslation("header_block");

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

  const handleSignin = useCallback(() => {
    handleAccountMenuClose();
    DialogEmitter.open(DIALOGS.SIGNIN);
  }, []);

  const handleSignout = useCallback(() => {
    handleAccountMenuClose();
    DialogEmitter.open(DIALOGS.SIGNOUT);
  }, []);

  const handleProfile = useCallback(() => {
    handleAccountMenuClose();
    DialogEmitter.open(DIALOGS.PROFILE);
  }, []);

  const handleSignup = useCallback(() => {
    handleAccountMenuClose();
    DialogEmitter.open(DIALOGS.SIGNUP);
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
            <Tooltip title={t("main_menu")}>
              <IconButton
                edge="start"
                color="inherit"
                className={classes.menuButton}
                aria-controls={MAIN_MENU_ID}
                aria-haspopup="true"
                onClick={handleMainMenuOpen}>
                <MenuIcon />
              </IconButton>
            </Tooltip>

            <Button variant="text" color="inherit" component={RouterLink} to={SCREENS.MAIN}>
              {process.env.APP_NAME}
            </Button>
            <div className={classes.grow} />

            <Tooltip title={t("toggle_theme")}>
              <IconButton color="inherit" onClick={handleChangeTheme}>
                {(theme.palette.type === "dark") ? <LightThemeIcon /> : <DarkThemeIcon />}
              </IconButton>
            </Tooltip>

            {/* Main menu buttons */}
            <Hidden xsDown implementation="css">
              <Tooltip title={t("list_events")}>
                <IconButton color="inherit" component={RouterLink} to={SCREENS.LIST_EVENTS}>
                  <TableIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("page_events")}>
                <IconButton color="inherit" component={RouterLink} to={SCREENS.PAGE_EVENTS}>
                  <ViewDay />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("event_map")}>
                <IconButton color="inherit" component={RouterLink} to={SCREENS.EVENT_MAP}>
                  <MapIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={t("create_event")}>
                <IconButton color="inherit" onClick={handleCreateEvent}>
                  <AddEventIcon />
                </IconButton>
              </Tooltip>
            </Hidden>

            <Tooltip title={t("account")}>
              <IconButton
                edge="end"
                aria-controls={ACCOUNT_MENU_ID}
                aria-haspopup="true"
                onClick={handleAccountMenuOpen}
                color="inherit"
              >
                {isLogged ? <AccountIcon /> : <GuestIcon />}
              </IconButton>
            </Tooltip>
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
        {!isLogged && <MenuItem onClick={handleSignin} dense>
          <ListItemIcon className={classes.menuItemIcon}>
            <LoginIcon />
          </ListItemIcon>
          <ListItemText primary={t("login")} />
        </MenuItem>}
        {!isLogged && <MenuItem onClick={handleSignup} dense>
          <ListItemIcon className={classes.menuItemIcon}>
            <CreateUserIcon />
          </ListItemIcon>
          <ListItemText primary={t("create_account")} />
        </MenuItem>}
        {isLogged && <MenuItem onClick={handleProfile} dense>
          <ListItemIcon className={classes.menuItemIcon}>
            <UserIcon />
          </ListItemIcon>
          <ListItemText primary={t("profile")} />
        </MenuItem>}
        {isLogged && <MenuItem onClick={handleSignout} dense>
          <ListItemIcon className={classes.menuItemIcon}>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary={t("logout")} />
        </MenuItem>}
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
            <ListItem button component={RouterLink} to={SCREENS.LIST_EVENTS} dense onClick={handleMainMenuClose}>
              <ListItemIcon className={classes.menuItemIcon}>
                <TableIcon />
              </ListItemIcon>
              <ListItemText primary={t("list_events")} />
            </ListItem>
            <ListItem button component={RouterLink} to={SCREENS.PAGE_EVENTS} dense onClick={handleMainMenuClose}>
              <ListItemIcon className={classes.menuItemIcon}>
                <ViewDay />
              </ListItemIcon>
              <ListItemText primary={t("page_events")} />
            </ListItem>
            <ListItem button component={RouterLink} to={SCREENS.EVENT_MAP} dense onClick={handleMainMenuClose}>
              <ListItemIcon className={classes.menuItemIcon}>
                <MapIcon />
              </ListItemIcon>
              <ListItemText primary={t("event_map")} />
            </ListItem>
            <ListItem button onClick={() => { handleMainMenuClose(); handleCreateEvent(); }} dense>
              <ListItemIcon className={classes.menuItemIcon}>
                <AddEventIcon />
              </ListItemIcon>
              <ListItemText primary={t("create_event")} />
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

const mapStateToProps = (state) => {
  const { isLogged } = state.user;
  return {
    isLogged
  };
};

export default connect(mapStateToProps)(Header);