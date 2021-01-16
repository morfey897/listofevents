
import { CircularProgress } from '@material-ui/core';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import { createBrowserHistory } from 'history';
import { useEffect, useReducer } from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Router } from 'react-router-dom';
import { runServices } from "../services";
import DateFnsUtils from '@date-io/date-fns';
import ThemeWrapper from './theme-wrapper';
import { STORE_INIT } from "../model/actions";
import { STATUSES } from '../enums';

const history = createBrowserHistory();

function reducer(state, action) {
  switch (action.type) {
    case "inited":
      return {
        ...state,
        status: STATUSES.STATUS_SUCCESS
      };
    case "runned":
      return {
        ...state,
        status: STATUSES.STATUS_UPDATED,
        results: action.payload
      };
    default:
      return {
        ...state
      };
  }
}

function Root() {

  const [state, dispatch] = useReducer(reducer, { status: STATUSES.STATUS_NONE, results: {} });

  useEffect(() => {
    if (state.status !== STATUSES.STATUS_NONE) return;
    dispatch({ type: "inited" });
    runServices()
      .then((results) => {
        dispatch({ type: "runned", payload: results });
      });
  }, []);


  return (state.status === STATUSES.STATUS_UPDATED ? (
    <Provider store={state.results.store} >
      {
        (function () {
          state.results.store.dispatch({ type: STORE_INIT });
        })()
      }
      <BrowserRouter>
        <Router history={history}>
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