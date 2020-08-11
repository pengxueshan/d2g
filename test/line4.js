import D2G from '../main.ts';

const wrap = document.createElement('div');
const header = document.createElement('h2');
wrap.id = 'line4';
wrap.className = 'chart';
header.innerText = '曲线图-坐标轴样式';
wrap.appendChild(header);
document.querySelector('#app').appendChild(wrap);
const chart = new D2G(
  {
    type: 'line',
    sortKey: 'date',
    xAxis: [
      {
        line: {
          show: false
        },
        tick: {
          num: 2,
          show: false
        },
      },
    ],
    yAxis: [
      {
        line: {
          show: false
        },
        tick: {
          num: 5,
          show: false
        },
      },
    ],
    line: {
      yGrid: {
        show: true,
        color: '#ddd'
      },
      lines: [{area: {show: false}}],
    },
  },
  '#line4'
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
