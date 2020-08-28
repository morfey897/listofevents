import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { AboutScreen, ContactsScreen, ListOfEventsScreen, EventMapScreen } from '../screens';
import { makeStyles } from '@material-ui/core';
import { Header } from '../components';
import { HOME, ABOUT, CONTACTS, EVENT_MAP, LIST_OF_EVENTS } from './screen-names';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    // display: "flex"
  },
  toolbar: theme.mixins.toolbar,
  content: {
    // flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing(3, 0),
  },
}));

function ScreenProvider({location}) {
  
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Header />
      <main className={classes.content}>
        <div className={classes.toolbar} />
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
      </main>
    </div>
  );
}

export default withRouter(ScreenProvider);