import React, { useEffect } from 'react';
import { Container, Typography, Grid, Paper, Hidden, Toolbar as MuiToolbar, LinearProgress } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { CalendarMontly, CalendarDaily, Filters, Toolbar } from '../components';
import { MONTH, WEEK, DAY } from '../enums/views';
import { connect } from 'react-redux';
import { compareAsc, isSameDay } from 'date-fns';
import { FUTURE, PAST, PRESENT } from '../enums/tense';
import {getColorIndex} from '../themes/colors';
import { bindActionCreators } from 'redux';
import { fetchEventsActionCreator } from "../model/actions";
import { STATE_READY, STATE_LOADING } from '../enums/states';

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
  },

  line: {
    height: 4
  },

}));

function ListOfEventsScreen({cities, categories, events, view, dateFrom, dateTo, cities_id, categories_id, fetchEvents, loading}) {

  const classes = useStyles();

  useEffect(() => {
    fetchEvents();
  }, [view, dateFrom, dateTo, categories_id, cities_id]);

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
                <Toolbar />
              </Paper>
            </Grid>
            <Grid item xs={12}>
              {loading ? <LinearProgress /> : <div className={classes.line} />}
              <Paper className={classes.calendar}>
                <Hidden mdUp>
                  <MuiToolbar variant={"dense"}>
                    <Filters variant={'secondary'} cities={cities} categories={categories} />
                  </MuiToolbar>
                </Hidden>
                {view === MONTH && <CalendarMontly events={events}/>}
                {(view === WEEK || view === DAY) && <CalendarDaily events={events}/>}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

const mapStateToProps = (state) => {
  const {cities: s_cities, categories: s_categories, events: s_events, filter} = state;
  const {now} = filter;

  const cities = s_cities.list.map(({_id, name, country}) => {
    return {_id, name, country: country.name, checked: state.filter.cities_id.indexOf(_id) != -1};
  });
  const categories = s_categories.list.map(({_id, name}, index) => {
    return {_id, name, checked: state.filter.categories_id.indexOf(_id) != -1, colorClass: generateColorClass({tense: FUTURE, colorIndex: getColorIndex(index)})}
  });
  const events = s_events.state === STATE_READY ? s_events.list.map(({_id, date, city, category}) => {
    const tense = isSameDay(date, now) ? PRESENT : (compareAsc(now, date) == 1 ? PAST : FUTURE);
    const colorClass = generateColorClass({tense, colorIndex: getColorIndex(categories.findIndex(({_id}) => _id == category._id))});
    return {_id, date, label: city.name, tense, colorClass};
  }) : [];

  return {
    loading: s_events.state === STATE_LOADING, 
    events,
    cities,
    categories,
    ...filter
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchEvents: fetchEventsActionCreator,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ListOfEventsScreen);