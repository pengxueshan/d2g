import colors from '../utils/colors.json';

export default {
  type: '',
  width: 300,
  height: 300,
  font: '12px serif',
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
  xAxis: [{
    show: true,
    position: 'bottom',
    mode: 'outside', // inside
    scalable: true,
    key: 'date',
    itemWidth: 0,
    itemCenter: false,
    line: {
      show: true,
      color: colors.black,
      width: 1,
    },
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
  }],
  yAxis: [{
    show: true,
    position: 'left',
    mode: 'outside', // inside
    key: 'value',
    line: {
      show: true,
      color: colors.black,
      width: 1,
    },
    padding: {
      left: 5
    },
    dataPadding: {
      top: 0.1,
      bottom: 0.1,
      start: ''
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
  }],
  line: {
    xGrid: {
      show: false,
      color: colors.gray, // or function
      dashLine: false,
    },
    yGrid: {
      show: false,
      color: colors.gray, // or function
      dashLine: false,
    },
    cross: {
      show: false
    },
    lines: [
      {
        type: '', // kline, singlex, singley, natural
        color: colors.black,
        width: 1,
        singleLabel: {
          position: 'right',
          show: true
        }, // for single line
        area: {
          show: true,
          color: ['rgba(255,0,0,0.6)', 'rgba(255,0,0,0.3)']
        },
        dot: {
          show: false,
          color: colors.black,
          radius: 4,
          width: 2,
          label: {
            show: false,
            color: colors.black,
          },
        },
      }
    ]
  },
  bar: {
    label: {
      show: false
    },
    color: []
  }
}