import _ from 'lodash';
import Chart from './chart';
import EventTypes from '../utils/events';
import pick from '../utils/pick';

class XAxis extends Chart {
  data = [];
  dimensions = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };

  constructor(config) {
    super();
    this.init(config);
  }

  init(c) {
    const { canvas, ctx, config, chartInfo } = c;
    this.canvas = canvas;
    this.ctx = ctx;
    this.chartInfo = chartInfo;
    this.setConfig(config);
  }

  setConfig(c = {}) {
    this.config = _.merge({}, this.config, c);
  }

  setData(data) {
    this.data = data;
    this.render();
  }

  formatData(data) {
    this.data = data;
  }

  calcHeight() {
    const { xAxis } = this.config;
    let height = 0;
    height += this.transValue(xAxis.lineWidth < 1 ? 1 : xAxis.lineWidth);
    if (xAxis.tick.show) {
      height += this.transValue(xAxis.tick.len);
    }
    if (xAxis.label.show) {
      height += this.textLineHeight;
      height += this.transValue(xAxis.label.offset);
    }
    if (xAxis.padding.top) {
      height += this.transValue(xAxis.padding.top);
    }
    if (xAxis.padding.bottom) {
      height += this.transValue(xAxis.padding.bottom);
    }
    if (height !== this.dimensions.height) {
      this.emit(EventTypes.UPDATE_CHART_INFO, {
        [this.id]: {
          height
        }
      });
    }
    this.dimensions.height = height;
  }

  calcDimensions() {
    const { xAxis } = this.config;
    if (!xAxis.show) {
      this.dimensions.x = 0;
      this.dimensions.y = 0;
      this.dimensions.width = 0;
      this.dimensions.height = 0;
      return;
    }
    this.calcHeight();
    let arr = [];
    let { width, height, ...rest } = this.chartInfo;
    let keys = Object.keys(rest);
    for (const key in keys) {
      if (key !== this.id) {
        arr.push(this.chartInfo[key]);
      }
    }
    arr.sort((a, b) => a.x - b.x);
    arr = arr.map(v => [v.x, v.x + v.width]);
    const d = pick(arr, 0, this.chartInfo.width);
    this.dimensions.x = d[0];
    this.dimensions.width = d[1] - d[0];
  }

  calcBand() { }

  renderXAxis() { }

  render() {
    this.calcDimensions();
  }
}

export default XAxis;