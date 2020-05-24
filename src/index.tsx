import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getConfig } from './Store';

const initialConfig = getConfig();

ReactDOM.render(
  <React.StrictMode>
    <App
      inTheZone={initialConfig.inTheZone}
      storageKey={initialConfig.storageKey}
      workingDay={initialConfig.workingDay}
      workingWeek={initialConfig.workingWeek} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
