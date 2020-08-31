import React from 'react';
import DropList from './drop-list';
import SelectDate from './select-date';

import { List, ListItemText, ListItem, ListItemIcon, Divider, Hidden } from '@material-ui/core';
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

function Filter() {

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

  return (
    <List>
      <Hidden smDown>
        <ListItem>
          <ListItemIcon>
            <FilterList />
          </ListItemIcon>
          <ListItemText primary="Filter" />
        </ListItem>
        <Divider />
      </Hidden>
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
    </List>);
}

export default Filter;