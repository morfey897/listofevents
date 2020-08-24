
import React from 'react';
import { BrowserRouter, Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from "@material-ui/core/CssBaseline";
import { ScreenProvider } from './providers';
import ListEventsTheme from "./app-theme";

function App() {

  return (
      <MuiThemeProvider theme={ListEventsTheme}>
        <CssBaseline />
        <BrowserRouter>
          <Router history={createBrowserHistory()}>
            <ScreenProvider />
          </Router>
        </BrowserRouter>
      </MuiThemeProvider>
  );
}

export default App;