import { applyMiddleware, compose, createStore, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';

import * as reducers from '../model/reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

class StoreService {

  init() {
    return Promise.resolve();
  }

  run() {
    return new Promise((resolve, reject) => {
      const preloadedState = undefined; //TODO can change
      
      const rootReducer = combineReducers(reducers);

      const middlewares = [thunkMiddleware];
      const middlewareEnhancer = applyMiddleware(...middlewares);
  
      const enhancers = [middlewareEnhancer];
      const composedEnhancers = composeEnhancers(...enhancers);
  
      const store = createStore(rootReducer, preloadedState, composedEnhancers);

      resolve({store});
    });
  }
}

export default StoreService;