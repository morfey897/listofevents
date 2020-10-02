
import React from 'react';
import { BrowserRouter, Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';

import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";
import { ScreenProvider } from './providers';
import MainTheme from "./thems/app-theme";
import configureStore from "./model/configure-store";

const store = configureStore();

function App() {

  return (
    <Provider store={store}>
      <MuiThemeProvider theme={MainTheme}>
        <CssBaseline />
        <BrowserRouter>
          <Router history={createBrowserHistory()}>
            <ScreenProvider />
          </Router>
        </BrowserRouter>
      </MuiThemeProvider>
    </Provider>
  );
}

export default App;