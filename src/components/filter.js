import React, { useState } from 'react';
import DropList from './drop-list';
import SelectDate from './select-date';

import { makeStyles, Drawer, Hidden, List, ListItemText, ListItem, ListItemIcon, Divider } from '@material-ui/core';
import { LocationCity, Flare, FilterList } from '@material-ui/icons';

const cities = [
  { _id: "1", name: "Kyiv", country: "Ukraine" },
  { _id: "2", name: "Lviv", country: "Ukraine" },
  { _id: "3", name: "Berlin", country: "Germany" },
  { _id: "4", name: "Leipzig", country: "Germany" }
];

const categories = [
  { _id: "1", name: "Master Class" },
  { _id: "2", name: "Concert" }
];

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: 'auto',
  },
  toolbar: theme.mixins.toolbar,
}));

function Filter() {

  const classes = useStyles();

  const [mobileOpen, setMobileOpen] = useState(false);

  const cityHeader = <>
    <ListItemIcon>
      <LocationCity />
    </ListItemIcon>
    <ListItemText primary={'Cities'} />
  </>;

  const categoryHeader = <>
    <ListItemIcon>
      <Flare />
    </ListItemIcon>
    <ListItemText primary={'Categories'} />
  </>;

  const drawer = (
    <div>
      <List>
        <ListItem>
          <ListItemIcon>
            <FilterList />
          </ListItemIcon>
          <ListItemText primary="Filter" />
        </ListItem>
        <Divider />
        <SelectDate />
        <Divider />
        <DropList
          isOpen={true}
          uniqId={'categories'}
          list={categories}
          header={categoryHeader}
          generator={({ name }) => ({ primary: name })}
        />
        <Divider />
        <DropList
          uniqId={'cities'}
          list={cities}
          header={cityHeader}
          generator={({ name, country }) => ({ primary: name, secondary: country })}
        />
        <Divider />
      </List>
    </div>);

  return (
    <nav className={classes.drawer} aria-label="mailbox folders">
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Hidden smUp implementation="css">
          <Drawer
            // container={container}
            variant="temporary"
            anchor={'right'}
            open={mobileOpen}
            onClose={() => setMobileOpen(!mobileOpen)}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            <div className={classes.toolbar} />
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden xsDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            anchor={'right'}
            open
          >
            <div className={classes.toolbar} />
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    // <Drawer
    //   className={classes.drawer}
    //   variant="permanent"
    //   anchor="right"
    //   classes={{
    //     paper: classes.drawerPaper,
    //   }}
    // >
    //   

    // </Drawer>
  );
}

export default Filter;