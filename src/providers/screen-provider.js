import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { AboutScreen, ContactsScreen, ListOfEventsScreen, EventMapScreen, MainScreen, JobsScreen, EventScreen, PageOfEventsScreen } from '../screens';
import { Box, makeStyles } from '@material-ui/core';
import { Header } from '../components';
import { SCREENS } from '../enums';
import Footer from '../components/footer';
import LineSeparator from '../components/separators';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  toolbar: theme.mixins.toolbar,
  content: {
    padding: 0
  },
  main: {
    backgroundColor: theme.palette.background.default,
  }
}));

function ScreenProvider({ location }) {

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Header />
      <main className={classes.main}>
        <div className={classes.toolbar} />
        <div className={classes.content}>
          <Switch location={location}>
            <Route exact path={SCREENS.MAIN} component={MainScreen} />
            <Route exact path={SCREENS.ABOUT} component={AboutScreen} />
            <Route exact path={SCREENS.CONTACTS} component={ContactsScreen} />
            <Route exact path={SCREENS.JOBS} component={JobsScreen} />
            <Route exact path={SCREENS.EVENT_MAP} component={EventMapScreen} />
            <Route exact path={SCREENS.EVENT_SCREEN} component={EventScreen} />
            <Route exact path={SCREENS.LIST_OF_EVENTS} component={ListOfEventsScreen} />
            <Route exact path={SCREENS.PAGE_OF_EVENTS} component={PageOfEventsScreen} />
            <Route path="*">
              <div>{`NotFound: ${location.pathname}`}</div>
            </Route>
          </Switch>
        </div>
      </main>
      <LineSeparator />
      <Footer />
    </div>
  );
}

export default withRouter(ScreenProvider);