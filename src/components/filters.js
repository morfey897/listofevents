import React, { useState, useCallback } from 'react';
import DropList from './drop-list';
import SelectDate from './select-date';

import { List, ListItemText, ListItem, ListItemIcon, Divider, IconButton, Popover, Typography, makeStyles, Badge } from '@material-ui/core';
import {
  FilterList as FilterListIcon,
  LocationCity as LocationIcon,
  Flare as CategoryIcon,
  DateRange as DateIcon,
} from '@material-ui/icons';

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

const POPOSER_POS = {
  anchorOrigin: {
    vertical: 'top',
    horizontal: 'left',
  },
  transformOrigin: {
    vertical: 'bottom',
    horizontal: 'right',
  }
};

const categoryGenerator = ({ name }) => ({ primary: name });
const locationGenerator = ({ name, country }) => ({ primary: name, secondary: country });

const useStyles = makeStyles(() => ({
  popoverDate: {
    maxWidth: 240,
  },
  popoverContent: {
    overflow: 'auto',
    maxHeight: 60 * 3.5,
    maxWidth: 240,
  },
  tableTitle: {
    flex: '1 1 100%',
  }
}));

function Filters({ variant }) {

  const classes = useStyles();

  const [dateOpen, setDateOpen] = useState(null);
  const [categoryOpen, setCategoryOpen] = useState(null);
  const [locationOpen, setLocationOpen] = useState(null);

  const handleOpenDate = useCallback((event) => {
    setDateOpen(event.currentTarget);
  }, []);

  const handleOpenCategory = useCallback((event) => {
    setCategoryOpen(event.currentTarget);
  }, []);

  const handleOpenLocation = useCallback((event) => {
    setLocationOpen(locationOpen ? null : event.currentTarget);
  }, []);

  const handleCloseDate = useCallback(() => {
    setDateOpen(null);
  }, []);

  const handleCloseCategory = useCallback(() => {
    setCategoryOpen(null);
  }, []);

  const handleCloseLocation = useCallback(() => {
    setLocationOpen(null);
  }, []);

  const onChangeDate = useCallback(({ from, to }) => {
    console.log(from, to);
  }, []);

  const onChangeCategory = useCallback((list) => {
    console.log("Category", list);
  }, []);

  const onChangeLocation = useCallback((list) => {
    console.log("Location", list);
  }, []);

  return (
    variant === 'primary' ?
      <List>
        <ListItem>
          <ListItemIcon>
            <FilterListIcon />
          </ListItemIcon>
          <ListItemText primary="Filter" />
        </ListItem>
        <Divider />
        <SelectDate onChange={onChangeDate} />
        <Divider />
        <ListItem>
          <ListItemIcon>
            <CategoryIcon />
          </ListItemIcon>
          <ListItemText primary={'Categories'} />
        </ListItem>
        <DropList
          showItems={4}
          list={categories}
          generator={categoryGenerator}
          onChange={onChangeCategory}
        />
        <Divider />
        <ListItem>
          <ListItemIcon>
            <LocationIcon />
          </ListItemIcon>
          <ListItemText primary={'Cities'} />
        </ListItem>
        <DropList
          showItems={2}
          list={cities}
          generator={locationGenerator}
          onChange={onChangeLocation}
        />
        <Divider />
      </List> :
      <>
        <Typography className={classes.tableTitle} variant="h6" component="div">
          List of events
        </Typography>

        <IconButton aria-label="select date range" onClick={handleOpenDate}>
          <Badge color="secondary" badgeContent={5}>
            <DateIcon />
          </Badge>
        </IconButton>

        <IconButton aria-label="categories list" onClick={handleOpenCategory}>
        <Badge color="secondary" badgeContent={5}>
          <CategoryIcon />
          </Badge>
        </IconButton>
        <IconButton aria-label="locations list" onClick={handleOpenLocation}>
        <Badge color="secondary" badgeContent={5}>
          <LocationIcon />
          </Badge>
        </IconButton>

        {/* Date popover */}
        <Popover
          open={Boolean(dateOpen)}
          anchorEl={dateOpen}
          onClose={handleCloseDate}
          {...POPOSER_POS}
        >
          <List className={classes.popoverDate}>
            <ListItem>
              <ListItemIcon>
                <DateIcon />
              </ListItemIcon>
              <ListItemText primary="Date range" />
            </ListItem>
            <Divider />
            <SelectDate onChange={onChangeDate} />
          </List>
        </Popover>

        {/* Category popover */}
        <Popover
          open={Boolean(categoryOpen)}
          anchorEl={categoryOpen}
          onClose={handleCloseCategory}
          {...POPOSER_POS}>
          <List className={classes.popoverContent} disablePadding>
            <DropList
              list={categories}
              generator={categoryGenerator}
              onChange={onChangeCategory}
            />
          </List>
        </Popover>

        {/* City popover */}
        <Popover
          open={Boolean(locationOpen)}
          anchorEl={locationOpen}
          onClose={handleCloseLocation}
          {...POPOSER_POS}>
          <List className={classes.popoverContent} disablePadding>
            <DropList
              list={cities}
              generator={locationGenerator}
              onChange={onChangeLocation}
            />
          </List>
        </Popover>
      </>);
}

export default Filters;