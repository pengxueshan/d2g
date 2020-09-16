import D2G from '../src/main.ts';
import datas from './data.json';
import _ from 'lodash';

const wrap = document.createElement('div');
const header = document.createElement('h2');
wrap.id = 'line7';
wrap.className = 'chart';
header.innerText = '曲线图-Y坐标轴在右侧';
wrap.appendChild(header);
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
const d = _.uniqBy(datas, 'date');
chart.setData([d]);
