import React from 'react';
import {
    Badge,
    Table,
} from 'react-bootstrap';
import {
    FaCouch,
    FaRunning,
    FaWalking
} from 'react-icons/fa';
import Progress from './Progress';
import Item from './Item';
import { totalCoding, forDay } from './Calculator';

interface CodingProps {
  codingHistory: Item[];
  currentState: string;
  inTheZone: number;
  now: number;
  workingDay: number;
  workingWeek: number;
}

function Coding(props: CodingProps) {
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
    let codingHistory = props.codingHistory;
    if (codingHistory.length > 0) {
      let mostRecentEvent = codingHistory[0];
      document.title = mostRecentEvent.event;
      return Math.max(0, now - mostRecentEvent.timestamp - startAfter);
    } else {
      return 0;
    }
  }

  function lastMinutes(now: number, minutes: number, startAfter: number = 0): number {
    return totalCoding(props.codingHistory, now - minutes * 60 * 1000, now, startAfter);
  }

  function lastWeek(now: number, startAfter: number = 0): number {
    let startOfWeek = new Date(now);
    startOfWeek.setHours(0, 0, 0, 0);
    startOfWeek.setDate(startOfWeek.getDate() - 7)
    return totalCoding(props.codingHistory, startOfWeek.getTime(), now, startAfter);
  }

  function timeStarted(now: number, startAfter: number = 0) {
    if (props.currentState === 'Start') {
      return elapsed(now, startAfter);
    }
    return 0;
  }

  function isInTheZone(now: number, startAfter: number = 0) {
    return props.currentState === 'Start' && elapsed(now, startAfter) > 0;
  }

  return (
    <Table striped bordered hover variant="dark">
        <tbody>
        <tr>
            <th>
            {props.currentState}&nbsp;
            <span className="Stop">
              <Badge variant="danger"><FaCouch /></Badge>
            </span>
            <span className="Start">
              {
                elapsed(props.now, props.inTheZone) > 0
                ? <Badge variant="success"><FaRunning /></Badge>
                : <Badge variant="warning"><FaWalking /></Badge>
              }
            </span>

            </th>
            <td>
                {formatTimeSpan(elapsed(props.now))}
            </td>
            <td>
                {
                    isInTheZone(props.now, props.inTheZone)
                    ? <Badge variant="success">{formatTimeSpan(elapsed(props.now, props.inTheZone))}</Badge>
                    : <Badge variant="warning">{formatTimeSpan(0)}</Badge>
                }
            </td>
            <td>
                <Progress percent={100 * timeStarted(props.now, 0) / props.inTheZone}/>
            </td>
        </tr>
        <tr>
            <th>Last hour</th>
            <td>
                {formatTimeSpan(lastMinutes(props.now, 60))}
            </td>
            <td>
                {formatTimeSpan(lastMinutes(props.now, 60, props.inTheZone))}
            </td>
            <td>
                <Progress percent={100 * lastMinutes(props.now, 60, props.inTheZone) / (60 * 60 * 1000)}/>
            </td>
        </tr>
        <tr>
            <th>Today</th>
            <td>
                {formatTimeSpan(forDay(props.codingHistory, props.now))}
            </td>
            <td>
                {formatTimeSpan(forDay(props.codingHistory, props.now, props.inTheZone))}
            </td>
            <td>
                <Progress percent={100 * forDay(props.codingHistory, props.now, props.inTheZone) / props.workingDay}/>
            </td>
        </tr>
        <tr>
            <th>This week</th>
            <td>
                {formatTimeSpan(lastWeek(props.now))}
            </td>
            <td>
                {formatTimeSpan(lastWeek(props.now, props.inTheZone))}
            </td>
            <td>
                <Progress percent={100 * lastWeek(props.now, props.inTheZone) / props.workingWeek}/>
            </td>
        </tr>
        </tbody>
    </Table>
  );
}

export default Coding;
