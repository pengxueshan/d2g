import D2G from '../src/main.ts';

const wrap = document.createElement('div');
const header = document.createElement('h2');
wrap.id = 'pie4';
wrap.className = 'chart';
header.innerText = '饼图-自定义角度';
wrap.appendChild(header);
document.querySelector('#app').appendChild(wrap);
const chart = new D2G(
  {
    type: 'pie',
    sortKey: 'value',
    pie: {
      radius: 0.6,
      inner: {
        radius: 0.6,
        color: 'yellow',
      },
      animation: true,
      startAngle: -0.25 * Math.PI,
      totalAngle: Math.PI,
    },
  },
  '#pie4'
);
chart.setData([
  {value: 1, color: 'red'},
  {value: 2, color: 'blue'},
  {value: 3, color: 'pink'},
  {value: 4, color: 'green'},
  {value: 5, color: 'gray'},
]);
