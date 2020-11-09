
import { CircularProgress } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { createBrowserHistory } from 'history';
import React, { useEffect, useReducer } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Router } from 'react-router-dom';
import { initServices, runServices } from "../services";
import DateFnsUtils from '@date-io/date-fns';
import ThemeWrapper from './theme-wrapper';

const ST_NONE = 0;
const ST_INITED = 1;
const ST_RUNNED = 2;

function reducer(state, action) {
  switch (action.type) {
    case "inited":
      return {
        ...state,
        condition: ST_INITED
      };
    case "runned":
      return {
        ...state,
        condition: ST_RUNNED,
        results: action.payload.reduce((prev, obj) => {
          for (let name in obj) {
            prev[name] = obj[name];
          }
          return prev;
        }, {})
      };
    default:
      return {
        ...state
      };
  }
}

function Root() {

  const [state, dispatch] = useReducer(reducer, { condition: ST_NONE, results: {} });

  useEffect(() => {
    if (state.condition !== ST_NONE) return;
    initServices()
      .then(() => {
        dispatch({ type: "inited" });
        return runServices();
      })
      .then((results) => {
        dispatch({ type: "runned", payload: results });
      });
  }, []);


  return (state.condition === ST_RUNNED ? (
    <Provider store={state.results.store}>
      <BrowserRouter>
        <Router history={createBrowserHistory()}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <ThemeWrapper />
          </MuiPickersUtilsProvider>
        </Router>
      </BrowserRouter>
    </Provider>
  ) : <div style={{ textAlign: "center" }}><CircularProgress /></div>
  );
}

export default Root;