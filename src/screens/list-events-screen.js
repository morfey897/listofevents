import React, { useEffect } from 'react';
import { Container, Typography, Grid, Paper, Hidden, Toolbar as MuiToolbar, LinearProgress, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core';
import { CalendarMontly, CalendarDaily, Filters, Toolbar } from '../components';
import { VIEWS, TENSE, STATUSES } from '../enums';
import { connect } from 'react-redux';
import { compareAsc, isSameDay } from 'date-fns';
import { getColorIndex } from '../themes/colors';
import { bindActionCreators } from 'redux';
import { fetchEventsActionCreator, fetchCitiesActionCreator, fetchCategoriesActionCreator } from "../model/actions";
import { useTranslation } from 'react-i18next';

const generateColorClass = ({ disabled, tense, colorIndex }) => {
  if (disabled) {
    tense = TENSE.PAST;
  }
  return `color_${tense}_${colorIndex}`;
};

const useStyles = makeStyles((theme) => ({

  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(6)
  },

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

function ListEventsScreen({ isLoading, cities, categories, events, filter, fetchCities, fetchCategories, citiesReady, categoriesReady, fetchEvents }) {

  const classes = useStyles();

  const { t } = useTranslation("list_events_screen");

  useEffect(() => {
    if (!citiesReady) {
      fetchCities();
    }
  }, [citiesReady]);

  useEffect(() => {
    if (!categoriesReady) {
      fetchCategories();
    }
  }, [categoriesReady]);

  useEffect(() => {
    fetchEvents();
  }, [filter.view, filter.dateFrom, filter.dateTo, filter.categories_id, filter.cities_id]);

  return (
    <Container className={classes.container}>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Typography paragraph>
            {t("description")}
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
        <Grid item xs={12} md={9}>
          <Grid item xs={12} >
            <Paper>
              <Toolbar />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            {isLoading ? <LinearProgress /> : <div className={classes.line} />}
            <Paper className={classes.calendar}>
              <Hidden mdUp>
                <MuiToolbar variant={"dense"}>
                  <Filters variant={'secondary'} cities={cities} categories={categories} />
                </MuiToolbar>
              </Hidden>
              {filter.view === VIEWS.MONTH && <CalendarMontly events={events} />}
              {(filter.view === VIEWS.WEEK || filter.view === VIEWS.DAY) && <CalendarDaily events={events} />}
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

const mapStateToProps = (state) => {
  const { cities: s_cities, categories: s_categories, events: s_events, filter } = state;
  const { now } = filter;

  const cities = s_cities.list.map(({ _id, name, description }) => {
    return { _id, name, description, checked: state.filter.cities_id.indexOf(_id) != -1 };
  });
  const categories = s_categories.list.map(({ _id, name }, index) => {
    return { _id, name, checked: state.filter.categories_id.indexOf(_id) != -1, colorClass: generateColorClass({ tense: TENSE.FUTURE, colorIndex: getColorIndex(index) }) };
  });
  const events = s_events.status === STATUSES.STATUS_SUCCESS ? s_events.list.map(({ _id, date, city, category }) => {
    const tense = isSameDay(date, now) ? TENSE.PRESENT : (compareAsc(now, date) == 1 ? TENSE.PAST : TENSE.FUTURE);
    const colorClass = generateColorClass({ tense, colorIndex: getColorIndex(categories.findIndex(({ _id }) => _id == category._id)) });
    return { _id, date, label: city.name, tense, colorClass };
  }) : [];

  return {
    isLoading: [s_events.status, s_cities.status, s_categories.status].some(state => state === STATUSES.STATUS_PENDING),
    citiesReady: s_cities.status === STATUSES.STATUS_SUCCESS,
    categoriesReady: s_categories.status === STATUSES.STATUS_SUCCESS,
    events: [],
    cities,
    categories,
    filter,
  };
};

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchEvents: fetchEventsActionCreator,
  fetchCities: fetchCitiesActionCreator,
  fetchCategories: fetchCategoriesActionCreator,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(ListEventsScreen);