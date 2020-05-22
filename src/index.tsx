import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';

var storageKey = "coding";
var inTheZone = 15 * 60 * 1000;
var workingDay = 7 * 60 * 60 * 1000;
var workingWeek = 5 * workingDay;

ReactDOM.render(
  <React.StrictMode>
    <App
      inTheZone={inTheZone}
      storageKey={storageKey}
      workingDay={workingDay}
      workingWeek={workingWeek} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
