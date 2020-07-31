import D2G from '../main.ts';
import datas from './data.json';

const wrap = document.createElement('div');
wrap.id = 'line3';
wrap.className = 'chart';
document.querySelector('#app').appendChild(wrap);
const chart = new D2G(
  {
    type: 'line',
    sortKey: 'date',
    window: 100,
    width: 500,
    xAxis: [
      {
        tick: {
          show: false,
          num: 2,
        },
        label: {
          format: (data) => {
            return data.slice(0, 10);
          },
        },
      },
    ],
    yAxis: [
      {
        tick: {
          show: false,
          num: 5,
        },
      },
    ],
    line: {
      cross: {show: true},
      lines: [{color: '#369', area: {show: false}}],
    },
  },
  '#line3'
);
chart.setData([datas]);
