import D2G from '../main.ts';

const wrap = document.createElement('div');
wrap.id = 'line1';
wrap.className = 'chart';
document.querySelector('#app').appendChild(wrap);
const chart = new D2G(
  {
    type: 'line',
    sortKey: 'date',
    xAxis: [
      {
        tick: {
          num: 5,
          color: 'red'
        },
      },
    ],
    yAxis: [
      {
        tick: {
          num: 5,
        },
      },
    ],
    line: {
      grid: {
        show: true,
      },
      lines: [{area: {show: false}}],
    },
  },
  '#line1'
);
chart.setData([
  [
    {value: 1, date: '2011'},
    {value: 3, date: '2012'},
    {value: 2, date: '2013'},
    {value: 5, date: '2014'},
    {value: 4, date: '2015'},
  ],
]);
