import D2G from '../src/main.ts';
import kline from './kline.json';

const wrap = document.createElement('div');
const header = document.createElement('h2');
wrap.id = 'line6';
wrap.className = 'chart';
header.innerText = 'K线图-Y坐标轴在内部';
wrap.appendChild(header);
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
        itemWidth: 6
      },
    ],
    yAxis: [
      {
        mode: 'inside',
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
      xGrid: {
        show: true
      },
      lines: [{type: 'kline', area: {show: false}}],
    },
  },
  '#line6'
);
chart.setData([kline]);
