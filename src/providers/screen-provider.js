import React, { useEffect } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { AboutScreen, ContactsScreen, ListOfEventsScreen, EventMapScreen } from '../screens';
import { LinearProgress, makeStyles } from '@material-ui/core';
import { Header } from '../components';
import { STATES, SCREENS } from '../enums';
import { bindActionCreators } from 'redux';
import { fetchCategoriesActionCreator, fetchCitiesActionCreator } from '../model/actions';
import { connect } from 'react-redux';
import JobsScreen from '../screens/jobs-screen';
import MainScreen from '../screens/main-screen';


const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    // display: "flex"
  },
  toolbar: theme.mixins.toolbar,
  content: {
    // flexGrow: 1,
    // padding: theme.spacing(3, 0),
    padding: 0
  },
  main: {
    // flexGrow: 1,
    backgroundColor: theme.palette.background.default,
  }
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
        {!citiesReady || !categoriesReady ? <LinearProgress /> :
          <div className={classes.content}>
            <Switch location={location}>
              <Route exact path={SCREENS.MAIN} component={MainScreen} />
              <Route exact path={SCREENS.ABOUT} component={AboutScreen} />
              <Route exact path={SCREENS.CONTACTS} component={ContactsScreen} />
              <Route exact path={SCREENS.JOBS} component={JobsScreen} />
              <Route exact path={SCREENS.EVENT_MAP} component={EventMapScreen} />
              <Route exact path={SCREENS.LIST_OF_EVENTS} component={ListOfEventsScreen} />
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
  citiesReady: state.cities.state === STATES.STATE_READY,
  categoriesReady: state.categories.state === STATES.STATE_READY,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  fetchCities: fetchCitiesActionCreator,
  fetchCategories: fetchCategoriesActionCreator,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ScreenProvider));