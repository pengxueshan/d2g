import D2G from '../src/main.ts';

const wrap = document.createElement('div');
const header = document.createElement('h2');
wrap.id = 'pie2';
wrap.className = 'chart';
header.innerText = '饼图-半圆';
wrap.appendChild(header);
document.querySelector('#app').appendChild(wrap);
const chart = new D2G(
  {
    type: 'pie',
    sort: false,
    pie: {
      radius: 0.6,
      inner: {
        radius: 0.5,
        color: '#fff',
      },
      startAngle: 0,
      totalAngle: Math.PI,
    },
  },
  '#pie2'
);
chart.setData([
  {value: 4, color: 'red'},
  {value: 2, color: 'blue'},
  {value: 3, color: 'pink'},
  {value: 1, color: 'green'},
  {value: 5, color: 'gray'},
]);
