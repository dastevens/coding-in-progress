import React, { useState, useEffect } from 'react';
import './App.css';
import { useBeforeunload } from 'react-beforeunload';
import { addItem, getCodingHistory, setCodingHistory } from './Store';
import Settings from './Settings';
import Coding from './Coding';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import Controls from './Controls';

interface AppProps {
  storageKey: string;
  inTheZone: number;
  workingDay: number;
  workingWeek: number;
}

function App(props: AppProps) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useBeforeunload(() => addItem(props.storageKey, "Stop"));

  function currentState(): string {
    let codingHistory = getCodingHistory(props.storageKey);
    if (codingHistory.length > 0) {
      let mostRecentEvent = codingHistory[0];
      return mostRecentEvent.event;
    } else {
      return 'Stop';
    }
  }

  return (
    <Container className={currentState()}>
      <Row>
        <Col>
          <Controls
            currentState = {currentState()}
            onStart={() => addItem(props.storageKey, "Start")}
            onStop={() => addItem(props.storageKey, "Stop")}
            />
        </Col>
      </Row>
      <Row>
        <Col>
          <Tabs defaultActiveKey="coding" id="app-tabs">
            <Tab eventKey="coding" title="Coding">
              <Coding
                currentState = {currentState()}
                inTheZone={props.inTheZone}
                now={now}
                codingHistory={getCodingHistory(props.storageKey)}
                workingDay={props.workingDay}
                workingWeek={props.workingWeek}
                />
            </Tab>

            <Tab eventKey="settings" title="Settings">
              <Settings 
                inTheZone={props.inTheZone}
                storageKey={props.storageKey}
                workingDay={props.workingDay}
                workingWeek={props.workingWeek}
                onResetHistory={() => {setCodingHistory(props.storageKey, []);}}
                />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
);
}

export default App;
