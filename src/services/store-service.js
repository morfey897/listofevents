import { applyMiddleware, compose, createStore, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { preloadMiddleware } from '../model/middlewares';

import * as reducers from '../model/reducers';
import Service from "./service";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

class StoreService extends Service {

  run() {
    return new Promise((resolve, reject) => {
      const preloadedState = undefined; //TODO can change

      const rootReducer = combineReducers(reducers);

      const middlewares = [thunkMiddleware, preloadMiddleware];
      const middlewareEnhancer = applyMiddleware(...middlewares);

      const enhancers = [middlewareEnhancer];
      const composedEnhancers = composeEnhancers(...enhancers);

      const store = createStore(rootReducer, preloadedState, composedEnhancers);
      resolve({ store });
    });
  }
}

export default StoreService;