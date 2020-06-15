import React from 'react';
import Item from './Item';
import Plotly from 'plotly.js';
import createPlotlyComponent from 'react-plotly.js/factory';
import { today, addDays, totalCoding } from './Calculator';
const Plot = createPlotlyComponent(Plotly);

interface ReportsProps {
  codingHistory: Item[];
  currentState: string;
  inTheZone: number;
  now: number;
  workingDay: number;
  workingWeek: number;
}

function Reports(props: ReportsProps) {

  const now = today();
  let days = [];
  for (var i = 0; i < 28; i++) {
    days.push(addDays(now, -i));
  }
  const data = days.map(timestamp => {
    return {
      timestamp,
      inTheZone: totalCoding(props.codingHistory, timestamp, Math.min(props.now, addDays(timestamp, 1)), props.inTheZone),
      started: totalCoding(props.codingHistory, timestamp, Math.min(props.now, addDays(timestamp, 1)))
    }
  });

  return (
    <div style={{height:"25em", width:"100%"}}>
      <Plot
        data={[
          {
            x: data.map(datum => new Date(datum.timestamp)),
            y: data.map(datum => datum.inTheZone / (60 * 1000)),
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'green'},
            name: 'In the zone'
          },
          {
            x: data.map(datum => new Date(datum.timestamp)),
            y: data.map(datum => datum.started / (60 * 1000)),
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'red'},
            name: 'Started',
          },
        ]}
        layout={{
          autosize: true,
          title: 'In the zone', 
          yaxis: {title:'Minutes'},
        }}
        style={{width:"100%", height:"100%"}}
        useResizeHandler={true}
      />
    </div>
);
}

export default Reports;
