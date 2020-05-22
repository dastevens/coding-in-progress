import React from 'react';
import {
    ProgressBar,
} from 'react-bootstrap';
import './App.css';

function Progress(props: {percent: number}) {
  if (props.percent < 100) {
    return (
      <ProgressBar variant='warning' now={props.percent} label={Math.floor(props.percent) + '%'}/>
    );
  }
  return (
    <ProgressBar variant="success" now={100}/>
  );
}

export default Progress;