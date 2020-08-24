
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Router } from 'react-router-dom';
import { appRoot } from './helpers/utils';
import { createBrowserHistory } from 'history';
import { ScreenProvider } from './providers';

ReactDOM.render(
  <BrowserRouter>
    <Router history={createBrowserHistory()}>
      <ScreenProvider />
    </Router>
  </BrowserRouter>,
  appRoot());
