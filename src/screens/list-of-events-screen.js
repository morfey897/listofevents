import React, { useEffect, useMemo, useState, useCallback } from 'react';
import { Container, Typography, Grid, Paper, Hidden, Toolbar as MuiToolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';

import { MontlyCalendar, WeeklyCalendar, DailyCalendar, Filters, Toolbar } from '../components';
import { MONTH, WEEK, DAY } from '../static/views';

const BASE_CITIES = ["Kyiv", "Lviv", "Viniza", "Odessa", "Kharkiv"];
const BASE_CATEGORIES = ["MasterClass", "Concert", "Event"];

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

const useStyles = makeStyles(() => ({

  showCalendar: {
    display: "block",
  },

  hideCalendar: {
    display: "none",
  }

}));

function ListOfEventsScreen() {
  const classes = useStyles();

  const memoDate = useMemo(() => new Date(), []);
  const memoView = useMemo(() => MONTH, []);

  const [stateView, setView] = useState(memoView);
  const [stateDate, setDate] = useState(memoDate);

  const handleChangeView = useCallback((view) => {
    setView(view);
  }, []);

  const handleChangeDate = useCallback((date) => {
    setDate(date);
  }, []);

  const events = useMemo(() => {

    const result = [];
    const len = 20;

    for (let j = 0; j < 3; j++) {
      for (let n = 0; n < len; n++) {
        let date = parseInt(Math.random() * 30 + 1);
        let hh = parseInt(Math.random() * 10 + 12);
        let mm = parseInt(Math.random() * 11) * 5;
        result.push({
          _id: n,
          date: new Date(2020, 7 + j, date, hh, mm),
          country: "Ukraine",
          city: BASE_CITIES[parseInt(Math.random() * BASE_CITIES.length)],
          category: BASE_CATEGORIES[parseInt(Math.random() * BASE_CATEGORIES.length)],
        });
      }
    }
    
    return result;
  }, []);

  return (
    <>
      <Container>
        <Grid container spacing={1}>
          <Grid item xs={12}>
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
          <Grid item xs={12}>
            
          </Grid>
          <Grid item xs={12} md={3}>
            <Hidden smDown>
              <Paper>
                <Filters variant={'primary'} cities={cities} categories={categories} />
              </Paper>
            </Hidden>
          </Grid>
          <Grid item container xs={12} md={9} spacing={1}>
            <Grid item xs={12}>
              <Paper>
                <Toolbar date={memoDate} view={memoView} onChangeDate={handleChangeDate} onChangeView={handleChangeView} />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              <Paper>
                <Hidden mdUp>
                  <MuiToolbar variant={"dense"}>
                    <Filters variant={'secondary'} cities={cities} categories={categories} />
                  </MuiToolbar>
                </Hidden>
                {stateView === MONTH && <MontlyCalendar date={stateDate} events={events} categories={categories} cities={cities} />}
                {stateView === WEEK && <WeeklyCalendar date={stateDate} events={events} categories={categories} cities={cities} />}
                {stateView === DAY && <DailyCalendar date={stateDate} events={events} categories={categories} cities={cities} />}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default ListOfEventsScreen;