import React, { useState, useEffect } from 'react';
import {
  Badge,
  Button,
  ProgressBar,
  Table,
  ButtonGroup
} from 'react-bootstrap';
import './App.css';
import { FaCouch, FaRunning, FaWalking } from 'react-icons/fa';
import { useBeforeunload } from 'react-beforeunload';

interface Item {
  event: string,
  timestamp: number,
}

var storageKey = "coding";
var inTheZone = 15 * 60 * 1000;
var workingDay = 7 * 60 * 60 * 1000;
var workingWeek = 5 * workingDay;

function getCodingHistory(): Item[] {
  let codingHistoryJson = localStorage.getItem(storageKey) || '[]';
  return JSON.parse(codingHistoryJson);
}

function setCodingHistory(codingHistory: Item[]) {
  localStorage.setItem(storageKey, JSON.stringify(codingHistory));
}

function addItem(event: string) {
  let codingHistory = getCodingHistory();
  let item = {event: event, timestamp: Date.now()};
  if (codingHistory.length === 0 || codingHistory[0].event !== event) {
    let updatedHistory = [item].concat(codingHistory);
    setCodingHistory(updatedHistory);
  }
}

function padNumber(number: number) {
    return number.toString().padStart(2, '0');
}

function formatTimeSpan(elapsedMilliseconds: number) {
  let elapsedSeconds = elapsedMilliseconds / 1000;
  let elapsedMinutes = elapsedSeconds / 60;
  let elapsedHours = elapsedMinutes / 60;
  return padNumber(Math.floor(elapsedHours)) + ':' +
    padNumber(Math.floor(elapsedMinutes) % 60) + ':' +
    padNumber(Math.floor(elapsedSeconds) % 60);
}

function elapsed(now: number, startAfter: number = 0): number {
  let codingHistory = getCodingHistory();
  if (codingHistory.length > 0) {
    let mostRecentEvent = getCodingHistory()[0];
    document.title = mostRecentEvent.event;
    return Math.max(0, now - mostRecentEvent.timestamp - startAfter);
  } else {
    return 0;
  }
}

function lastMinutes(now: number, minutes: number, startAfter: number = 0): number {
  return totalCoding(now - minutes * 60 * 1000, now, startAfter);
}

function today(now: number, startAfter: number = 0): number {
  let midnight = new Date();
  midnight.setHours(0, 0, 0, 0);
  return totalCoding(midnight.getDate(), now, startAfter);
}

function thisWeek(now: number, startAfter: number = 0): number {
  let startOfWeek = new Date();
  startOfWeek.setHours(0, 0, 0, 0);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
  return totalCoding(startOfWeek.getDate(), now, startAfter);
}

function totalCoding(start: number, end: number, startAfter: number = 0) {
  start = start - startAfter;
  let codingHistory = [{event:'Stop', timestamp: end}].concat(getCodingHistory());
  let totalCoding = 0;
  for (let i = 1; i < codingHistory.length; i++) {
    let item = codingHistory[i - 1];
    let last = codingHistory[i];
    let from = Math.min(end, Math.max(start, last.timestamp));
    let to = Math.min(end, Math.max(start, item.timestamp));
    let duration = to - from;
    if (last.event === 'Start' && duration >= startAfter) {
      totalCoding += duration - startAfter;
    }
  }
  return totalCoding;
}

function startCoding() {
  addItem('Start');
}

function stopCoding() {
  addItem('Stop');
}

function currentState(): string {
  let codingHistory = getCodingHistory();
  if (codingHistory.length > 0) {
    let mostRecentEvent = getCodingHistory()[0];
    return mostRecentEvent.event;
  } else {
    return 'Stop';
  }
}

function timeStarted(now: number, startAfter: number = 0) {
  if (currentState() === 'Start') {
    return elapsed(now, startAfter);
  }
  return 0;
}

function isInTheZone(now: number, startAfter: number = 0) {
  return currentState() === 'Start' && elapsed(now, startAfter) > 0;
}

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

function App() {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  useBeforeunload(stopCoding);

  return (
    <div className={"App " + currentState()}>

      <ButtonGroup size="lg">
        <Button variant={currentState() === 'Start' ? "danger" : "secondary"} onClick={stopCoding}>Stop <FaCouch /></Button>
        <Button variant={currentState() === 'Stop' ? "primary" : "secondary"} onClick={startCoding}>Start <FaRunning /></Button>
      </ButtonGroup>

      <Table striped bordered hover variant="dark">
          <tbody>
          <tr>
              <th>
              {currentState()}&nbsp;
              <span className="Stop">
                <Badge variant="danger"><FaCouch /></Badge>
              </span>
              <span className="Start">
                {
                  elapsed(now, inTheZone) > 0
                  ? <Badge variant="success"><FaRunning /></Badge>
                  : <Badge variant="warning"><FaWalking /></Badge>
                }
              </span>

              </th>
              <td>
                  {formatTimeSpan(elapsed(now))}
              </td>
              <td>
                  {
                      isInTheZone(now, inTheZone)
                      ? <Badge variant="success">{formatTimeSpan(elapsed(now, inTheZone))}</Badge>
                      : <Badge variant="warning">{formatTimeSpan(elapsed(now, inTheZone))}</Badge>
                  }
              </td>
              <td>
                  <Progress percent={100 * timeStarted(now, 0) / inTheZone}/>
              </td>
          </tr>
          <tr>
              <th>Last 15 minutes</th>
              <td>
                  {formatTimeSpan(lastMinutes(now, 15))}
              </td>
              <td>
                  {formatTimeSpan(lastMinutes(now, 15, inTheZone))}
              </td>
              <td>
                  <Progress percent={100 * lastMinutes(now, 15, inTheZone) / (15 * 60 * 1000)}/>
              </td>
          </tr>
          <tr>
              <th>Last 30 minutes</th>
              <td>
                  {formatTimeSpan(lastMinutes(now, 30))}
              </td>
              <td>
                  {formatTimeSpan(lastMinutes(now, 30, inTheZone))}
              </td>
              <td>
                  <Progress percent={100 * lastMinutes(now, 30, inTheZone) / (30 * 60 * 1000)}/>
              </td>
          </tr>
          <tr>
              <th>Last hour</th>
              <td>
                  {formatTimeSpan(lastMinutes(now, 60))}
              </td>
              <td>
                  {formatTimeSpan(lastMinutes(now, 60, inTheZone))}
              </td>
              <td>
                  <Progress percent={100 * lastMinutes(now, 60, inTheZone) / (60 * 60 * 1000)}/>
              </td>
          </tr>
          <tr>
              <th>Today</th>
              <td>
                  {formatTimeSpan(today(now))}
              </td>
              <td>
                  {formatTimeSpan(today(now, inTheZone))}
              </td>
              <td>
                  <Progress percent={100 * today(now, inTheZone) / workingDay}/>
              </td>
          </tr>
          <tr>
              <th>This week</th>
              <td>
                  {formatTimeSpan(thisWeek(now))}
              </td>
              <td>
                  {formatTimeSpan(thisWeek(now, inTheZone))}
              </td>
              <td>
                  <Progress percent={100 * thisWeek(now, inTheZone) / workingWeek}/>
              </td>
          </tr>
          </tbody>
      </Table>
    </div>
  );
}

export default App;
