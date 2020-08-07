
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
// import App from './app';
import { appRoot } from './helpers/utils';

ReactDOM.render(
  <BrowserRouter>
    <div>
      <p>Some Text this</p>
    </div>
  </BrowserRouter>,
  appRoot());
