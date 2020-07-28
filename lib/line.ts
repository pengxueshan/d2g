import Chart from './chart';
import EventTypes from '../utils/events';

class Line extends Chart {
  data = [];
  windowIndex = [0, 0];

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

  setConfig(c) { }

  setData(data) {
    this.data = data;
    this.render();
  }

  formatData(data) {
    const { xAxis } = this.config;
    let tmpData = data.concat();
    if (xAxis.sort) {
      const key = xAxis.key;
      tmpData.sort((a, b) => {
        return a[key] - b[key];
      });
    }
    this.data = tmpData;
    this.calcWindow();
  }

  calcWindow() {
    const { xAxis } = this.config;
    if (!xAxis.window) {
      this.windowIndex = [0, this.data.length - 1];
    } else if (xAxis.window <= 1) {
      const num = Math.floor(this.data.length * xAxis.window);
      this.windowIndex[1] = this.windowIndex[0] + num;
    } else {
      this.windowIndex[1] = this.windowIndex[0] + xAxis.window;
    }
    if (this.windowIndex[1] > this.data.length - 1) {
      this.windowIndex[1] = this.data.length - 1;
    }
  }

  calcXAxisHeight() {
    const { xAxis } = this.config;
    if (!xAxis.show) return 0;
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
      xAxis: {
        height
      }
    });
    return height;
  }

  calcBand() { }

  renderXAxis() { }

  render() { }
}

export default Line;