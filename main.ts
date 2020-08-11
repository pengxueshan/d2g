import _ from 'lodash';
import config from './lib/config';
import Chart from './lib/chart';
import Pie from './lib/pie';
import Line from './lib/line';
import XAxis from './lib/xaxis';
import YAxis from './lib/yaxis';
import EventTypes from './utils/events';
import { ChartType } from './utils/chart';

class D2G extends Chart {
  wrap = null;
  chart = [];
  originData = [];
  windowXIndexOffset = 0;
  windowIndex = [0, 0];

  dragInfo = {
    startX: 0,
    startY: 0,
    windowIndex: 0
  };
  xband = 0;

  constructor(options, selector) {
    super(options);
    this.init(options, selector);
  }

  init(options = {}, selector = '') {
    let cloneConfig = _.cloneDeep(config);
    const opts = this.mergeConfig(cloneConfig, options);
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
        this.addEvents();
        this.initChart();
      }
    }
  }

  mergeConfig(a, b) {
    return _.mergeWith(a, b, (value, source) => {
      if (_.isArray(value) && _.isArray(source) && value.length < source.length) {
        value = source.map(() => _.cloneDeep(value[0]));
        return _.merge(value, source);
      }
    });
  }

  initChart() {
    if (!this.config.type) return;
    const config = this.getGlobalConfig();
    switch (this.config.type) {
      case 'pie':
        this.initPie(config);
        break;
      case 'line':
        this.initLine(config);
        break;
    }
    this.chart.forEach(c => {
      c.on(EventTypes.UPDATE_CHART_INFO, this.handleUpdateChartInfo);
    });
  }

  initPie(config) {
    this.chart.push(new Pie(config));
  }

  initLine(config) {
    const { config: c, ...rest } = config;
    const { xAxis, yAxis } = c;
    const xCharts = xAxis.map(x => {
      const g = new XAxis({
        config: x,
        ...rest
      });
      this.chart.push(g);
      return g;
    });
    const yCharts = yAxis.map(y => {
      const g = new YAxis({
        config: y,
        ...rest
      });
      this.chart.push(g);
      return g;
    });
    this.chart.push(new Line({
      config: c.line,
      ...rest
    }, xCharts, yCharts));
  }

  addEvents() {
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('mouseleave', this.handleMouseLeave);
    this.addDragEvents();
  }

  handleMouseMove = (e) => {
    this.chart.forEach(c => {
      if (typeof c.onMouseMove === 'function') {
        c.onMouseMove({
          x: this.transValue(e.offsetX),
          y: this.transValue(e.offsetY)
        });
      }
    });
  };

  handleMouseLeave = () => {
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('mousemove', this.handleDragMouseMove);
    this.canvas.removeEventListener('mouseup', this.handleDragMouseUp);
    this.chart.forEach(c => {
      if (typeof c.onMouseLeave === 'function') {
        c.onMouseLeave();
      }
    });
  };

  addDragEvents() {
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
  }

  handleMouseDown = (e) => {
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    this.dragInfo.startX = e.offsetX;
    this.dragInfo.startY = e.offsetY;
    this.dragInfo.windowIndex = this.windowIndex[0];
    this.calcXBand();
    this.canvas.addEventListener('mousemove', this.handleDragMouseMove);
    this.canvas.addEventListener('mouseup', this.handleDragMouseUp);
  };

  calcXBand() {
    if (!this.xband) {
      for (let i = 0; i < this.chart.length; i++) {
        const c = this.chart[i];
        if (c.type === ChartType.xAxis && c.band) {
          this.xband = c.band;
          break;
        }
      }
    }
  }

  handleDragMouseMove = (e) => {
    if (!this.xband) return;
    const delta = Math.floor((e.offsetX - this.dragInfo.startX) / this.xband);
    this.windowXIndexOffset = -delta;
    this.calcWindow();
  };

  handleDragMouseUp = () => {
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.removeEventListener('mousemove', this.handleDragMouseMove);
    this.canvas.removeEventListener('mouseup', this.handleDragMouseUp);
  };

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
    if (!Array.isArray(tmpData[0])) {
      tmpData = [tmpData];
    }
    if (sort) {
      tmpData.forEach(d => {
        d.sort((a, b) => {
          return a[sortKey] - b[sortKey];
        });
      });
      // if (tmpData.length === 1) {
      // } else {
      //   let keys = tmpData.map(d => {
      //     return d[sortKey];
      //   });
      //   keys = _.flatten(keys);
      //   keys = _.uniq(keys);
      //   keys.sort((a, b) => a - b);
      //   tmpData.map(d => {
      //     return keys.map(k => {
      //       let f = d.find(item => item[sortKey] === k);
      //       return f || { [sortKey]: k };
      //     });
      //   });
      // }
    }
    this.originData = tmpData;
    this.calcWindow();
  }

  calcWindow() {
    let { window } = this.config;
    window = window > this.originData[0].length ? this.originData[0].length : window;
    this.windowIndex[0] = this.dragInfo.windowIndex + this.windowXIndexOffset;
    if (!window) {
      this.windowIndex = [0, this.originData[0].length - 1];
    } else if (window <= 1) {
      const num = Math.floor(this.originData[0].length * window);
      this.windowIndex[1] = this.windowIndex[0] + num;
    } else {
      this.windowIndex[1] = this.windowIndex[0] + window;
    }
    if (this.windowIndex[0] < 0) {
      this.windowIndex[1] += Math.abs(this.windowIndex[0]);
      this.windowIndex[0] = 0;
    }
    if (this.windowIndex[1] > this.originData[0].length) {
      this.windowIndex[0] -= this.windowIndex[1] - this.originData[0].length;
      this.windowIndex[1] = this.originData[0].length;
    }
    if (this.chart.length) {
      const data = this.originData.map(d => d.slice(this.windowIndex[0], this.windowIndex[1] + 1));
      // this.clear();
      this.chart.forEach(c => c.setData(data, this.originData));
    }
  }

  getGlobalConfig() {
    return {
      canvas: this.canvas,
      ctx: this.ctx,
      config: this.config,
      chartInfo: this.chartInfo,
      wrap: this.wrap
    };
  }

  clear() {
    const { width, height } = this.chartInfo;
    this.ctx.clearRect(0, 0, width, height);
  }

  render() {
    if (this.chart.length) {
      // this.clear();
      this.chart.forEach(c => c.render());
    }
  }
}

export default D2G;