
import React from 'react';
import { BrowserRouter, Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { Provider } from 'react-redux';

import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";
import { ScreenProvider } from './providers';
import MainTheme from "./themes/app-theme";
import configureStore from "./model/configure-store";
import DialogProvider from './providers/dialog-provider';

const store = configureStore();

function App() {

  return (
    <Provider store={store}>
      <MuiThemeProvider theme={MainTheme}>
        <CssBaseline />
        <BrowserRouter>
          <Router history={createBrowserHistory()}>
            <ScreenProvider />
            <DialogProvider />
          </Router>
        </BrowserRouter>
      </MuiThemeProvider>
    </Provider>
  );
}

export default App;