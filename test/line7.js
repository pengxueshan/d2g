import D2G from '../main.ts';
import datas from './data.json';

const wrap = document.createElement('div');
wrap.id = 'line7';
wrap.className = 'chart';
document.querySelector('#app').appendChild(wrap);
const chart = new D2G(
  {
    type: 'line',
    sortKey: 'date',
    window: 50,
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
        position: 'right',
        mode: 'inside',
        tick: {
          num: 5,
        },
      },
    ],
    line: {
      yGrid: {
        show: true
      },
      cross: {show: true},
      lines: [{color: '#369', area: {show: false}}],
    },
  },
  '#line7'
);
chart.setData([datas]);
