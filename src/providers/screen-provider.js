import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import { AboutScreen, ContactsScreen, PrivacyPolicyScreen, ListEventsScreen, MainScreen, EventScreen, PageEventsScreen, CategoryScreen, SearchScreen } from '../screens';
import { makeStyles } from '@material-ui/core';
import urljoin from "url-join";
import { Header } from '../components';
import { SCREENS } from '../enums';
import Footer from '../components/footer';
import LineSeparator from '../components/line-separator';
import { connect } from 'react-redux';

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

function ScreenProvider({ location, events, categories }) {

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
            <Route exact path={SCREENS.PRIVACY_POLICY} component={PrivacyPolicyScreen} />
            <Route exact path={SCREENS.LIST_EVENTS} component={ListEventsScreen} />
            <Route exact path={SCREENS.PAGE_EVENTS} component={PageEventsScreen} />
            <Route exact path={SCREENS.SEARCH} component={SearchScreen} />
            {/* <Route exact path={SCREENS.EVENT_MAP} component={EventMapScreen} /> */}
            {
              events.map(({ _id, url }) => <Route key={_id} exact path={url} render={() => <EventScreen _id={_id} />} />)
            }
            {
              categories.map(({ _id, url }) => <Route key={_id} exact path={url} render={() => <CategoryScreen _id={_id} />} />)
            }

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
const mapStateToProps = (state) => {
  const { events, categories } = state;
  // 
  // let categoriesList = events.list.map(({category}) => ({...category}));

  let categoriesList = {};
  for (let i = 0; i < events.list.length; i++) {
    let cat = events.list[i].category;
    categoriesList[cat._id] = cat.url;
  }

  for (let i = 0; i < categories.list.length; i++) {
    let cat = categories.list[i];
    categoriesList[cat._id] = cat.url;
  }

  return {
    events: events.list,
    categories: Object.keys(categoriesList).map(_id => ({ _id, url: urljoin(SCREENS.CATEGORY, categoriesList[_id]) }))
  };
};

export default connect(mapStateToProps)(withRouter(ScreenProvider));