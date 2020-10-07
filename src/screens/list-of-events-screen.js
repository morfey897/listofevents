import React, { useMemo, useState, useCallback } from 'react';
import { Container, Typography, Grid, Paper, Hidden, Toolbar as MuiToolbar } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';

import { MontlyCalendar as CalendarMontly, WeeklyCalendar as CalendarWeekly, DailyCalendar as CalendarDaily, Filters, Toolbar } from '../components';
import { MONTH, WEEK, DAY } from '../static/views';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { compareAsc, isSameDay } from 'date-fns';
import { FUTURE, PAST, PRESENT } from '../static/tense';

const generateColorClass = ({disabled, tense, colorIndex}) => {
  if (disabled) {
    tense = PAST;
  }
  return `color_${tense}_${colorIndex}`;
};

const useStyles = makeStyles((theme) => ({

  showCalendar: {
    display: "block",
  },

  hideCalendar: {
    display: "none",
  },

  calendar: {
    margin: theme.spacing(1, 0)
  }

}));

const NOW = new Date();

function ListOfEventsScreen({cities, categories, events}) {

  const classes = useStyles();

  const memoView = useMemo(() => MONTH, []);

  const [stateView, setView] = useState(memoView);
  const [stateDate, setDate] = useState(NOW);

  const handleChangeView = useCallback((view) => {
    setView(view);
  }, []);

  const handleChangeDate = useCallback((date) => {
    setDate(date);
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
                <Filters variant={'primary'} cities={cities} categories={categories}/>
              </Paper>
            </Hidden>
          </Grid>
          <Grid item xs={12} md={9}>
            <Grid item xs={12} >
              <Paper>
                <Toolbar date={NOW} view={memoView} onChangeDate={handleChangeDate} onChangeView={handleChangeView} />
              </Paper>
            </Grid>
            <Grid item xs={12} className={classes.calendar}>
              <Paper>
                <Hidden mdUp>
                  <MuiToolbar variant={"dense"}>
                    <Filters variant={'secondary'} cities={cities} categories={categories} />
                  </MuiToolbar>
                </Hidden>
                {stateView === MONTH && <CalendarMontly date={stateDate} events={events} now={NOW}/>}
                {stateView === WEEK && <CalendarWeekly date={stateDate} events={events} now={NOW}/>}
                {stateView === DAY && <CalendarDaily date={stateDate} events={events} now={NOW}/>}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

const mapStateToProps = (state) => {
  const cities = state.cities.list.map(({_id, name, country}) => ({_id, name: name.ru, country: country.name.ru}));
  const categories = state.categories.list.map(({_id, name}, index) => ({_id, name: name.ru, colorClass: generateColorClass({tense: FUTURE, colorIndex: Math.min(index + 1, 9)})}));

  const events = [];
  const len = 20;

  for (let j = 0; j < 3; j++) {
    for (let n = 0; n < len; n++) {
      let date = parseInt(Math.random() * 30 + 1);
      let hh = parseInt(Math.random() * 10 + 12);
      let mm = parseInt(Math.random() * 11) * 5;
      let city = cities[parseInt(Math.random() * cities.length)];
      let category = categories[parseInt(Math.random() * categories.length)];

      let newEvent = {
        _id: n,
        date: new Date(2020, 7 + j, date, hh, mm),
        label: city.name
      };

      newEvent.tense = isSameDay(newEvent.date, NOW) ? PRESENT : (compareAsc(NOW, newEvent.date) == 1 ? PAST : FUTURE);
      newEvent.colorClass = generateColorClass({tense: newEvent.tense, colorIndex: Math.min(categories.findIndex(({_id}) => _id == category._id) + 1, 9)});
      events.push(newEvent);
    }
  }

  return {
    events,
    cities,
    categories
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  // fetchCities: fetchCitiesActionCreator,
  // fetchCategories: fetchCategoriesActionCreator,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ListOfEventsScreen);