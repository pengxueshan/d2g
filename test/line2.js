import D2G from '../main.ts';

const wrap = document.createElement('div');
const header = document.createElement('h2');
wrap.id = 'line2';
wrap.className = 'chart';
header.innerText = '曲线图-多条线-多Y坐标';
wrap.appendChild(header);
document.querySelector('#app').appendChild(wrap);
const chart = new D2G(
  {
    type: 'line',
    sortKey: 'date',
    xAxis: [
      {
        tick: {
          num: 5,
        },
      },
    ],
    yAxis: [
      {
        tick: {
          num: 5,
        },
      },
      {
        position: 'right',
        label: {
          format: (data) => {
            return ((data * 100) / 20).toFixed(2) + '%';
          },
          color: (data) => {
            if (data.label > 5) {
              return 'red';
            }
            return 'green';
          },
        },
        tick: {
          num: 5,
        },
      },
    ],
  },
  '#line2'
);
chart.setData([
  [
    {value: 1, date: '2011'},
    {value: 3, date: '2012'},
    {value: 2, date: '2013'},
    {value: 5, date: '2014'},
    {value: 4, date: '2015'},
  ],
  [
    {value: 6, date: '2011'},
    {value: 8, date: '2012'},
    {value: 7, date: '2013'},
    {value: 10, date: '2014'},
    {value: 9, date: '2015'},
  ],
]);
