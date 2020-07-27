import D2G from '../main.ts';

const chart1 = new D2G({
  type: 'pie',
  pie: {
    radius: 0.6,
    inner: {
      radius: 0.5,
      color: '#fff'
    },
    startAngle: -Math.PI,
    totalAngle: Math.PI
  }
}, '#chart1');
chart1.setData([
  { value: 1, color: 'red' },
  { value: 2, color: 'blue' },
  { value: 3, color: 'pink' },
  { value: 4, color: 'green' },
  { value: 5, color: 'gray' },
]);

const chart2 = new D2G({
  type: 'pie',
  pie: {
    sort: false,
    radius: 0.6,
    inner: {
      radius: 0.5,
      color: '#fff'
    },
    startAngle: 0,
    totalAngle: Math.PI
  }
}, '#chart2');
chart2.setData([
  { value: 4, color: 'red' },
  { value: 2, color: 'blue' },
  { value: 3, color: 'pink' },
  { value: 1, color: 'green' },
  { value: 5, color: 'gray' },
]);

const chart3 = new D2G({
  type: 'pie',
  pie: {
    radius: 0.6,
    inner: {
      radius: 0.5,
      color: '#fff'
    },
    animation: true
  }
}, '#chart3');
chart3.setData([
  { value: 1, color: 'red' },
  { value: 2, color: 'blue' },
  { value: 3, color: 'pink' },
  { value: 4, color: 'green' },
  { value: 5, color: 'gray' },
]);
