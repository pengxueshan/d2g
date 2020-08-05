import D2G from '../main.ts';
import kline from './kline.json';

const wrap = document.createElement('div');
wrap.id = 'line5';
wrap.className = 'chart';
document.querySelector('#app').appendChild(wrap);
const chart = new D2G(
  {
    type: 'line',
    sortKey: 'time',
    window: 50,
    width: 600,
    xAxis: [
      {
        key: 'time',
        tick: {
          num: 6,
          show: false,
        },
        label: {
          format: (data) => {
            return data.slice(0, 8);
          },
        },
      },
    ],
    yAxis: [
      {
        key: ['open', 'close', 'high', 'low'],
        tick: {
          num: 5,
        },
      },
    ],
    line: {
      cross: {show: true},
      yGrid: {
        show: true,
      },
      lines: [{type: 'kline', area: {show: false}}, {type: 'singley', color: 'blue'}],
    },
  },
  '#line5'
);
chart.setData([kline, [{value: 15}]]);