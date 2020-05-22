import React, { useState, useEffect } from 'react';
import {
    Badge,
    Button,
    Table,
    ButtonGroup
} from 'react-bootstrap';
import './App.css';
import {
    FaCouch,
    FaRunning,
    FaWalking
} from 'react-icons/fa';
import { useBeforeunload } from 'react-beforeunload';
import { getCodingHistory, addItem } from './Store';
import Progress from './Progress';

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

  useBeforeunload(stopCoding);

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
    let codingHistory = getCodingHistory(props.storageKey);
    if (codingHistory.length > 0) {
      let mostRecentEvent = codingHistory[0];
      document.title = mostRecentEvent.event;
      return Math.max(0, now - mostRecentEvent.timestamp - startAfter);
    } else {
      return 0;
    }
  }

  function lastMinutes(now: number, minutes: number, startAfter: number = 0): number {
    return totalCoding(now - minutes * 60 * 1000, now, startAfter);
  }

  function forDay(now: number, startAfter: number = 0): number {
    let midnight = new Date(now);
    midnight.setHours(0, 0, 0, 0);
    return totalCoding(midnight.getTime(), now, startAfter);
  }

  function thisWeek(now: number, startAfter: number = 0): number {
    let startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay())
    return totalCoding(startOfWeek.getTime(), now, startAfter);
  }

  function totalCoding(start: number, end: number, startAfter: number = 0) {
    start = start - startAfter;
    let codingHistory = [{event:'Stop', timestamp: end}].concat(getCodingHistory(props.storageKey));
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
    addItem(props.storageKey, 'Start');
  }

  function stopCoding() {
    addItem(props.storageKey, 'Stop');
  }

  function currentState(): string {
    let codingHistory = getCodingHistory(props.storageKey);
    if (codingHistory.length > 0) {
      let mostRecentEvent = codingHistory[0];
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
                  elapsed(now, props.inTheZone) > 0
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
                      isInTheZone(now, props.inTheZone)
                      ? <Badge variant="success">{formatTimeSpan(elapsed(now, props.inTheZone))}</Badge>
                      : <Badge variant="warning">{formatTimeSpan(elapsed(now, props.inTheZone))}</Badge>
                  }
              </td>
              <td>
                  <Progress percent={100 * timeStarted(now, 0) / props.inTheZone}/>
              </td>
          </tr>
          <tr>
              <th>Last 15 minutes</th>
              <td>
                  {formatTimeSpan(lastMinutes(now, 15))}
              </td>
              <td>
                  {formatTimeSpan(lastMinutes(now, 15, props.inTheZone))}
              </td>
              <td>
                  <Progress percent={100 * lastMinutes(now, 15, props.inTheZone) / (15 * 60 * 1000)}/>
              </td>
          </tr>
          <tr>
              <th>Last 30 minutes</th>
              <td>
                  {formatTimeSpan(lastMinutes(now, 30))}
              </td>
              <td>
                  {formatTimeSpan(lastMinutes(now, 30, props.inTheZone))}
              </td>
              <td>
                  <Progress percent={100 * lastMinutes(now, 30, props.inTheZone) / (30 * 60 * 1000)}/>
              </td>
          </tr>
          <tr>
              <th>Last hour</th>
              <td>
                  {formatTimeSpan(lastMinutes(now, 60))}
              </td>
              <td>
                  {formatTimeSpan(lastMinutes(now, 60, props.inTheZone))}
              </td>
              <td>
                  <Progress percent={100 * lastMinutes(now, 60, props.inTheZone) / (60 * 60 * 1000)}/>
              </td>
          </tr>
          <tr>
              <th>Today</th>
              <td>
                  {formatTimeSpan(forDay(now))}
              </td>
              <td>
                  {formatTimeSpan(forDay(now, props.inTheZone))}
              </td>
              <td>
                  <Progress percent={100 * forDay(now, props.inTheZone) / props.workingDay}/>
              </td>
          </tr>
          <tr>
              <th>This week</th>
              <td>
                  {formatTimeSpan(thisWeek(now))}
              </td>
              <td>
                  {formatTimeSpan(thisWeek(now, props.inTheZone))}
              </td>
              <td>
                  <Progress percent={100 * thisWeek(now, props.inTheZone) / props.workingWeek}/>
              </td>
          </tr>
          </tbody>
      </Table>
    </div>
  );
}

export default App;
