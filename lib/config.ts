import colors from '../utils/colors.json';

export default {
  type: '',
  width: 300,
  height: 300,
  font: '12pt',
  window: 0,
  sort: true,
  sortKey: 'date',
  pie: {
    radius: 1,
    inner: {
      radius: 0,
      color: colors.black
    },
    labelOffset: 10,
    label: {
      show: true,
      lineLength: 20
    },
    startAngle: -0.5 * Math.PI,
    totalAngle: 2 * Math.PI,
    animation: false
  },
  xAxis: {
    show: true,
    position: 'bottom',
    mode: 'outside', // inside
    scalable: true,
    key: 'date',
    color: colors.black,
    lineWidth: 1,
    padding: {
      bottom: 5
    },
    label: {
      show: true,
      color: colors.black, // or function
      format: null, // or function
      offset: 5,
    },
    tick: {
      show: true,
      num: 2,
      len: 5,
      color: colors.black, // or function
    },
    grid: {
      show: false,
      color: colors.gray, // or function
    }
  },
  yAxis: {
    show: true,
    position: 'left',
    mode: 'outside', // inside
    color: colors.black,
    lineWidth: 1,
    padding: {
      left: 5
    },
    label: {
      show: true,
      color: colors.black, // or function
      format: null, // or function
      offset: 5,
    },
    tick: {
      show: true,
      num: 2,
      len: 5,
      color: colors.black, // or function
    },
    grid: {
      show: false,
      color: colors.gray, // or function
    }
  },
}