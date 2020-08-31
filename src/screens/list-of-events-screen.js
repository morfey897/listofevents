import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { request } from '../api/graphQL';
import { filterEvents } from '../api/queries/event-query';
import { Container, Typography, Grid, Paper, Hidden, Toolbar, IconButton, Popover, List, ListItem, ListItemIcon, ListItemText, Divider } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { 
        FilterList as FilterListIcon,
        LocationCity as LocationIcon, 
        Flare as CategoryIcon,
        DateRange as DateIcon,
        } from '@material-ui/icons';
import { Calendar, Filters, SelectDate, CategoryDropList, CityDropList } from '../components';

const useStyles = makeStyles((theme) => ({
  
}));


function ListOfEventsScreen() {
  const classes = useStyles();

  const cities = ["Kyiv", "Lviv", "Viniza", "Odessa", "Kharkiv"];
  const categories = ["MasterClass", "Concert", "Event"];

  const events = useMemo(() => {

    const result = [];
    const len = 30;

    for (let n = 0; n < len; n++) {
      let date = parseInt(Math.random() * 30 + 1);
      let hh = parseInt(Math.random() * 10 + 12);
      let mm = parseInt(Math.random() * 11) * 5;
      result.push({
        date: new Date(2020, 7, date, hh, mm/*   `2020-08-${date}T${hh}:${mm}:00Z`*/),
        country: "Ukraine",
        city: cities[parseInt(Math.random() * cities.length)],
        category: categories[parseInt(Math.random() * categories.length)],
      });
    }

    console.log(result);
    return result;
  }, []);

  return (
    <>
      <Container>
        <Grid container spacing={1}>
          <Grid item>
            <Typography paragraph>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt
              ut labore et dolore magna aliqua. Rhoncus dolor purus non enim praesent elementum
              facilisis leo vel. Risus at ultrices mi tempus imperdiet. Semper risus in hendrerit
              gravida rutrum quisque non tellus. Convallis convallis tellus id interdum velit laoreet id
              donec ultrices. Odio morbi quis commodo odio aenean sed adipiscing. Amet nisl suscipit
              adipiscing bibendum est ultricies integer quis. Cursus euismod quis viverra nibh cras.
              Metus vulputate eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo quis
              imperdiet massa tincidunt. Cras tincidunt lobortis feugiat vivamus at augue. At augue eget
              arcu dictum varius duis at consectetur lorem. Velit sed ullamcorper morbi tincidunt. Lorem
              donec massa sapien faucibus et molestie ac.
        </Typography>
          </Grid>
          <Grid item xs={12} md={3}>
            <Hidden smDown>
              <Paper>
                <Filters variant={'primary'}/>
              </Paper>
            </Hidden>
          </Grid>
          <Grid item xs={12} md={9}>
            <Paper>
              <Hidden mdUp>
                <Toolbar variant={"dense"}>
                  <Filters variant={'secondary'}/>
                </Toolbar>
              </Hidden>
              <Calendar date={new Date()} events={events} categories={categories} cities={cities} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default ListOfEventsScreen;