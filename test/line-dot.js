import D2G from '../src/main.ts';

const wrap = document.createElement('div');
const header = document.createElement('h2');
wrap.id = 'line-dot';
wrap.className = 'chart';
header.innerText = '曲线图-点';
wrap.appendChild(header);
document.querySelector('#app').appendChild(wrap);
const chart = new D2G(
  {
    type: 'line',
    sortKey: 'date',
    xAxis: [
      {
        line: {
          show: false,
        },
        tick: {
          // num: 2,
          show: false,
        },
        itemWidth: 30,
        itemCenter: true,
      },
    ],
    yAxis: [
      {
        line: {
          show: false,
        },
        tick: {
          num: 5,
          show: false,
        },
        dataPadding: {
          top: 0.2,
          bottom: 0.2,
        },
      },
    ],
    line: {
      yGrid: {
        show: true,
        color: '#ddd',
      },
      lines: [
        {
          color: '#205AF4',
          area: {show: false},
          dot: {
            show: true,
            color: '#205AF4',
            label: {show: true},
          },
        },
      ],
    },
  },
  '#line-dot'
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
console.log(chart.getChartDimensions());
console.log(chart.getXRange([35, 290]));
