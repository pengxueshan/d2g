import config from './config';
import _ from 'lodash';
import Chart from './lib/chart';
import Pie from './lib/pie';
import { Config, ChartInfo } from './lib/types';

class D2G extends Chart {
  canvas = null;
  ctx = null;
  config: Config = {};
  chartInfo: ChartInfo = {};
  chart = null;

  constructor(options, selector) {
    super();
    this.init(options, selector);
  }

  init(options = {}, selector = '') {
    const opts = _.merge({}, config, options);
    this.config = opts;
    const c = document.createElement('canvas');
    this.canvas = c;
    this.ctx = c.getContext('2d');
    const canvasWidth = this.transValue(opts.width);
    const canvasHeight = this.transValue(opts.height);
    c.setAttribute('width', canvasWidth + 'px');
    c.setAttribute('height', canvasHeight + 'px');
    c.setAttribute('style', `width:${opts.width}px;height:${opts.height}`);
    this.chartInfo.width = canvasWidth;
    this.chartInfo.height = canvasHeight;
    if (selector) {
      const n = document.querySelector(selector);
      if (n) {
        n.appendChild(c);
        this.initChart();
      }
    }
  }

  initChart() {
    if (!this.config.type) return;
    const config = this.getGlobalConfig();
    switch (this.config.type) {
      case 'pie':
        this.chart = new Pie(config);
        break;
    }
  }

  setData(data) {
    if (this.chart) {
      this.chart.setData(data);
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
    if (this.chart) {
      this.chart.render();
    }
  }
}

export default D2G;