import _ from 'lodash';
import Chart from './chart';
import EventTypes from '../utils/events';
import pick from '../utils/pick';

class YAxis extends Chart {
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

  calcWidth() {
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
    this.emit(EventTypes.UPDATE_CHART_INFO, {
      [this.id]: {
        height
      }
    });
    this.dimensions.height = height;
  }

  calcHeight() {
    const { yAxis } = this.config;
    let arr = [];
    let { width, height, ...rest } = this.chartInfo;
    let keys = Object.keys(rest);
    for (const key in keys) {
      if (key !== this.id) {
        arr.push(this.chartInfo[key]);
      }
    }
    arr.sort((a, b) => a.y - b.y);
    arr = arr.map(v => [v.y, v.y + v.height]);
    const d = pick(arr, 0, this.chartInfo.height);
    this.dimensions.y = d[0];
    this.dimensions.height = d[1] - d[0];
  }

  calcDimensions() {
    const { yAxis } = this.config;
    if (!yAxis.show) {
      this.dimensions.x = 0;
      this.dimensions.y = 0;
      this.dimensions.width = 0;
      this.dimensions.height = 0;
      return;
    }
    this.calcHeight();
    this.calcWidth();
  }

  calcBand() { }

  renderXAxis() { }

  render() {
    this.calcDimensions();
  }
}

export default YAxis;