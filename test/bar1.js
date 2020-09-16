import D2G from '../src/main.ts';
import _ from 'lodash';

const wrap = document.createElement('div');
const header = document.createElement('h2');
wrap.id = 'bar1';
wrap.className = 'chart';
header.innerText = '柱状图';
wrap.appendChild(header);
document.querySelector('#app').appendChild(wrap);
const chart = new D2G(
  {
    type: 'bar',
    sortKey: 'date',
    width: 500,
    xAxis: [
      {
        tick: {
          num: 5,
        },
        itemWidth: 40
      },
    ],
    yAxis: [
      {
        tick: {
          num: 2,
        },
        dataPadding: {
          start: 0
        }
      },
    ],
  },
  '#bar1'
);
chart.setData([
  {date: '2020-01-01', value: 1},
  {date: '2020-01-02', value: 2},
  {date: '2020-01-03', value: 3},
  {date: '2020-01-04', value: 4},
  {date: '2020-01-05', value: 5},
]);
