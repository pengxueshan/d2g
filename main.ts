import _ from 'lodash';
import config from './lib/config';
import Chart from './lib/chart';
import Pie from './lib/pie';
import Line from './lib/line';
import XAxis from './lib/xaxis';
import YAxis from './lib/yaxis';
import EventTypes from './utils/events';

class D2G extends Chart {
  wrap = null;
  chart = [];
  originData = [];

  windowIndex = [0, 0];

  constructor(options, selector) {
    super(options);
    this.init(options, selector);
  }

  init(options = {}, selector = '') {
    const opts = _.merge({}, config, options);
    this.config = opts;
    const wrap = document.createElement('div');
    wrap.setAttribute('style', 'position:relative;');
    const c = document.createElement('canvas');
    wrap.appendChild(c);
    this.wrap = wrap;
    this.canvas = c;
    this.ctx = c.getContext('2d');
    this.ctx.font = opts.font;
    const canvasWidth = this.transValue(opts.width);
    const canvasHeight = this.transValue(opts.height);
    c.setAttribute('width', canvasWidth + 'px');
    c.setAttribute('height', canvasHeight + 'px');
    c.setAttribute('style', `width:${opts.width}px;height:${opts.height}px;vertical-align:top;`);
    this.chartInfo.width = canvasWidth;
    this.chartInfo.height = canvasHeight;
    if (selector) {
      const n = document.querySelector(selector);
      if (n) {
        n.appendChild(wrap);
        this.initChart();
      }
    }
  }

  initChart() {
    if (!this.config.type) return;
    const config = this.getGlobalConfig();
    switch (this.config.type) {
      case 'pie':
        this.chart.push(new Pie(config));
        break;
      case 'line':
        this.chart.push(new XAxis(config));
        this.chart.push(new YAxis(config));
        this.chart.push(new Line(config));
        break;
    }
    this.chart.forEach(c => {
      c.on(EventTypes.UPDATE_CHART_INFO, this.handleUpdateChartInfo);
    });
  }

  handleUpdateChartInfo = (info, id) => {
    this.chartInfo = _.merge({}, this.chartInfo, info);
    this.chart.forEach(c => {
      if (c.id === id) return;
      c.setChartInfo(this.chartInfo);
      if (typeof c.calcDimensions === 'function') {
        c.calcDimensions();
      }
    });
  }

  setData(data) {
    const { sort, sortKey } = this.config;
    let tmpData = data.concat();
    if (sort) {
      tmpData.sort((a, b) => {
        return a[sortKey] - b[sortKey];
      });
    }
    this.originData = tmpData;
    this.calcWindow();
  }

  calcWindow() {
    const { window } = this.config;
    if (!window) {
      this.windowIndex = [0, this.originData.length - 1];
    } else if (window <= 1) {
      const num = Math.floor(this.originData.length * window);
      this.windowIndex[1] = this.windowIndex[0] + num;
    } else {
      this.windowIndex[1] = this.windowIndex[0] + window;
    }
    if (this.windowIndex[1] > this.originData.length - 1) {
      this.windowIndex[1] = this.originData.length - 1;
    }
    if (this.chart.length) {
      const data = this.originData.slice(this.windowIndex[0], this.windowIndex[1] + 1);
      this.chart.forEach(c => c.setData(data));
    }
  }

  getGlobalConfig() {
    return {
      canvas: this.canvas,
      ctx: this.ctx,
      config: this.config,
      chartInfo: this.chartInfo,
    };
  }

  render() {
    if (this.chart.length) {
      this.chart.forEach(c => c.render());
    }
  }
}

export default D2G;