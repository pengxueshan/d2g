import D2G from '../main.ts';

const wrap = document.createElement('div');
wrap.id = 'pie1';
wrap.className = 'chart';
document.querySelector('#app').appendChild(wrap);
const chart = new D2G(
  {
    type: 'pie',
    sortKey: 'value',
    pie: {
      radius: 0.6,
      inner: {
        radius: 0.5,
        color: '#fff',
      },
      startAngle: -Math.PI,
      totalAngle: Math.PI,
    },
  },
  '#pie1'
);
chart.setData([
  {value: 1, color: 'red'},
  {value: 2, color: 'blue'},
  {value: 3, color: 'pink'},
  {value: 4, color: 'green'},
  {value: 5, color: 'gray'},
]);
