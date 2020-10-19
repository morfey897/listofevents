
import { createBrowserHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Router } from 'react-router-dom';
import ThemeWrapper from './theme-wrapper';
import configureStore from "../model/configure-store";

const store = configureStore();

function Root() {

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Router history={createBrowserHistory()}>
          <ThemeWrapper />
        </Router>
      </BrowserRouter>
    </Provider>
  );
}

export default Root;