import React from 'react';
import {
    Button,
    ButtonGroup
} from 'react-bootstrap';
import './App.css';
import {
    FaCouch,
    FaRunning,
} from 'react-icons/fa';

interface ControlsProps {
  currentState: string;
  onStart: () => void;
  onStop: () => void;
}

function Controls(props: ControlsProps) {

  return (
      <ButtonGroup size="lg">
        <Button variant={props.currentState === 'Start' ? "danger" : "secondary"} onClick={props.onStop}>Stop <FaCouch /></Button>
        <Button variant={props.currentState === 'Stop' ? "primary" : "secondary"} onClick={props.onStart}>Start <FaRunning /></Button>
      </ButtonGroup>
  );
}

export default Controls;
