import React, { useEffect } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { AboutScreen, ContactsScreen, ListOfEventsScreen, EventMapScreen } from '../screens';
import { LinearProgress, makeStyles } from '@material-ui/core';
import { Header } from '../components';
import { HOME, ABOUT, CONTACTS, EVENT_MAP, LIST_OF_EVENTS } from '../static/screens';
import { bindActionCreators } from 'redux';
import { STATE_READY } from '../model/enums';
import { fetchCategoriesActionCreator, fetchCitiesActionCreator } from '../model/actions';
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    // display: "flex"
  },
  toolbar: theme.mixins.toolbar,
  content: {
    // flexGrow: 1,
    padding: theme.spacing(3, 0),
  },
  main: {
    // flexGrow: 1,
    backgroundColor: theme.palette.background.default,
  },
}));

function ScreenProvider({ location, citiesReady, categoriesReady, fetchCities, fetchCategories }) {

  const classes = useStyles();

  useEffect(() => {
    if (!citiesReady) {
      fetchCities();
    }
    if (!categoriesReady) {
      fetchCategories();
    }
  }, [citiesReady, categoriesReady]);

  return (
    <div className={classes.root}>
      <Header />
      <main className={classes.main}>
        <div className={classes.toolbar} />
        {(!citiesReady || !categoriesReady) ? <LinearProgress /> :
          <div className={classes.content}>
            <Switch location={location}>
              <Route exact path={HOME} component={ListOfEventsScreen} />
              <Route exact path={ABOUT} component={AboutScreen} />
              <Route exact path={CONTACTS} component={ContactsScreen} />
              <Route exact path={EVENT_MAP} component={EventMapScreen} />
              <Route exact path={LIST_OF_EVENTS} component={ListOfEventsScreen} />
              <Route path="*">
                <div>{`NotFound: ${location.pathname}`}</div>
              </Route>
            </Switch>
          </div>
        }
      </main>
    </div>
  );
}


const mapStateToProps = (state) => ({
  citiesReady: state.cities.state === STATE_READY,
  categoriesReady: state.categories.state === STATE_READY,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchCities: fetchCitiesActionCreator,
  fetchCategories: fetchCategoriesActionCreator,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ScreenProvider));