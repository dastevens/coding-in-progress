import React, { useState, useEffect } from 'react';
import './App.css';
import { useBeforeunload } from 'react-beforeunload';
import { addItem, getCodingHistory, setCodingHistory, setConfig as storeConfig, getConfig, resetConfig } from './Store';
import Settings from './Settings';
import Coding from './Coding';
import Reports from './Reports';
import { Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import Controls from './Controls';
import Config from './Config';

function App() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const [config, setConfig] = useState(getConfig());

  useBeforeunload(() => addItem("Stop"));

  function currentState(): string {
    let codingHistory = getCodingHistory();
    if (codingHistory.length > 0) {
      let mostRecentEvent = codingHistory[0];
      return mostRecentEvent.event;
    } else {
      return 'Stop';
    }
  }

  function updateConfig(newConfig: Config) {
    console.log(newConfig);
    storeConfig(newConfig);
    setConfig(newConfig);
  }

  return (
    <Container className={currentState()}>
      <Row>
        <Col>
          <Tabs defaultActiveKey="reports" id="app-tabs">
            <Tab eventKey="coding" title="Coding">
              <Controls
                currentState = {currentState()}
                onStart={() => addItem("Start")}
                onStop={() => addItem("Stop")}
                />
              <Coding
                currentState = {currentState()}
                inTheZone={config.inTheZone}
                now={now}
                codingHistory={getCodingHistory()}
                workingDay={config.workingDay}
                workingWeek={config.workingWeek}
                />
            </Tab>

            <Tab eventKey="reports" title="Reports">
              <Reports
                currentState = {currentState()}
                inTheZone={config.inTheZone}
                now={now}
                codingHistory={getCodingHistory()}
                workingDay={config.workingDay}
                workingWeek={config.workingWeek}
                />
            </Tab>

            <Tab eventKey="settings" title="Settings">
              <Settings 
                inTheZone={config.inTheZone}
                workingDay={config.workingDay}
                workingWeek={config.workingWeek}
                onResetHistory={() => {setCodingHistory([]);}}
                onChange={newConfig => {updateConfig(newConfig);}}
                onResetConfig={() => {updateConfig(resetConfig());}}
                />
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </Container>
);
}

export default App;
