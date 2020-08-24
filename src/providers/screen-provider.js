import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { MainScreen, MapScreen } from '../screens';

const ScreenProvider = () => {
  return (
    <Switch>
      <Route exact path={"/"} component={MainScreen} />
      <Route exact path={"/about"} component={MapScreen} />
      <Route exact path={"/contacts"} component={MapScreen} />
      <Route exact path={"/event-map"} component={MapScreen} />
      <Route exact path={"/list-of-event"} component={MapScreen} />
    </Switch>
  );
};

export default ScreenProvider;