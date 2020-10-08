import React, { useState, useCallback } from 'react';
import DropList from './drop-list';

import { List, ListItemText, ListItem, ListItemIcon, Divider, IconButton, Popover, Typography, makeStyles, Badge } from '@material-ui/core';
import {
  FilterList as FilterListIcon,
  LocationCity as LocationIcon,
  Flare as CategoryIcon,
} from '@material-ui/icons';
import { capitalCaseTransform as capitalCase } from 'change-case';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { filterToggleCityIdActionCreator, filterToggleCategoryIdActionCreator } from "../model/actions";

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

const categoryGenerator = ({ name }) => ({ primary: capitalCase(name) });
const locationGenerator = ({ name, country }) => ({ primary: capitalCase(name), secondary: capitalCase(country) });

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

function Filters({ variant, categories, cities, toggleCityId, toggleCategoryId }) {

  const classes = useStyles();

  const [categoryOpen, setCategoryOpen] = useState(null);
  const [locationOpen, setLocationOpen] = useState(null);

  const handleOpenCategory = useCallback((event) => {
    setCategoryOpen(event.currentTarget);
  }, []);

  const handleOpenLocation = useCallback((event) => {
    setLocationOpen(locationOpen ? null : event.currentTarget);
  }, []);

  const handleCloseCategory = useCallback(() => {
    setCategoryOpen(null);
  }, []);

  const handleCloseLocation = useCallback(() => {
    setLocationOpen(null);
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
          onToggle={toggleCategoryId}
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
          onToggle={toggleCityId}
        />
        <Divider />
      </List> :
      <>
        <Typography className={classes.tableTitle} variant="h6" component="div">
          List of events
        </Typography>

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
              onToggle={toggleCategoryId}
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
              onToggle={toggleCityId}
            />
          </List>
        </Popover>
      </>);
}

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = dispatch => bindActionCreators({
  toggleCityId: filterToggleCityIdActionCreator,
  toggleCategoryId: filterToggleCategoryIdActionCreator,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Filters);