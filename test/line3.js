import D2G from '../main.ts';
import datas from './data.json';
import _ from 'lodash';

const wrap = document.createElement('div');
const header = document.createElement('h2');
wrap.id = 'line3';
wrap.className = 'chart';
header.innerText = '曲线图-拖动(控制显示的数据量)';
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
const d = _.uniqBy(datas, 'date');
chart.setData([d]);
