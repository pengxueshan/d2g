import { EventEmitter } from 'events';
import { Config, ChartInfo } from '../utils/types';
import { v4 } from 'uuid';
import pick from '../utils/pick';
import XAxis from './xaxis';
import YAxis from './yaxis';

class Chart extends EventEmitter {
  id = '';
  data = [];
  originData = [];
  ratio = 1;
  textLineHeight = 12;
  fontSize = 12;
  font = '12px serif';
  wrap = null;
  canvas = null;
  ctx: CanvasRenderingContext2D = null;
  config: Config = {};
  chartInfo: ChartInfo = {};
  dimensions = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };
  prevDimensions = null;
  range = [0, 0];
  band = 0;
  xAxis: Array<XAxis> = null;
  yAxis: Array<YAxis> = null;
  axisConfig = null;

  constructor({ font = '12px serif' } = {}) {
    super();
    this.id = v4();
    this.ratio = window.devicePixelRatio || 1;
    const fontSize = parseInt(font.match(/\d+/).join(), 10);
    this.fontSize = this.transValue(fontSize);
    this.font = font.replace(/(\d+)/, (m) => this.transValue(+m) + '');
    this.textLineHeight = this.transValue(fontSize);
  }

  init(c) {
    const { wrap, canvas, ctx, config, chartInfo, font } = c;
    this.wrap = wrap;
    this.canvas = canvas;
    this.ctx = ctx;
    this.chartInfo = chartInfo;
    this.font = font;
    this.setConfig(config);
  }

  setConfig(c = {}) { }

  transValue(v, isToReal = true) {
    if (isToReal) {
      return v * this.ratio;
    } else {
      return v / this.ratio;
    }
  }

  /**
   * @param (Array) dest [x1, x2, y1, y2]
   */
  checkIsCover(dest, src) {
    return !(src[2] >= dest[3] || src[3] <= dest[2] || src[0] >= dest[1] || src[1] <= dest[0]);
  }

  setChartInfo(info) {
    this.chartInfo = info;
  }

  calcDimensions() {
    let arr = [];
    let { width, height, ...rest } = this.chartInfo;
    let keys = Object.keys(rest);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      if (key !== this.id) {
        arr.push(this.chartInfo[key]);
      }
    }
    let xarr = arr.filter(d => d.x !== undefined);
    xarr.sort((a, b) => a.x - b.x);
    xarr = xarr.map(v => [v.x, v.x + v.width]);
    const xd = pick(xarr, 0, width);
    this.dimensions.x = xd[0];
    this.dimensions.width = xd[1] - xd[0];
    let yarr = arr.filter(d => d.y !== undefined);
    yarr.sort((a, b) => a.y - b.y);
    yarr = yarr.map(v => [v.y, v.x + v.height]);
    const yd = pick(yarr, 0, height);
    this.dimensions.y = yd[0];
    this.dimensions.height = yd[1] - yd[0];
    this.render();
  }

  value(point, isReverse = false, roundType = 'round') {
    const { x, y } = point;
    if (this.band) {
      const roundMethod = {
        'round': Math.round,
        'ceil': Math.ceil,
        'floor': Math.floor
      }[roundType];
      const xDis = x - this.dimensions.x;
      let xIndex = roundMethod(xDis / this.band);
      const yDis = y - this.dimensions.y;
      let yIndex = roundMethod(yDis / this.band);
      if (xIndex < 0) {
        xIndex = 0;
      } else if (xIndex > this.data[0].length - 1) {
        xIndex = this.data[0].length - 1;
      }
      if (yIndex < 0) {
        yIndex = 0;
      } else if (yIndex > this.data[0].length - 1) {
        yIndex = this.data[0].length - 1;
      }
      return {
        xIndex,
        yIndex
      };
    } else {
      const xPercent = (x - this.dimensions.x) / this.dimensions.width;
      const yPercent = (y - this.dimensions.y) / this.dimensions.height;
      const value = this.range[1] - this.range[0];
      let xValue = xPercent * value;
      if (isReverse) {
        xValue = this.range[1] - xValue;
      } else {
        xValue = this.range[0] + xValue;
      }
      let yValue = yPercent * value;
      if (isReverse) {
        yValue = this.range[1] - yValue;
      } else {
        yValue = this.range[0] + yValue;
      }
      return {
        x: xValue,
        y: yValue,
      };
    }
  }

  point(datas, value, isReverse = false, key?) {
    let xDis;
    let yDis;
    if (this.band) {
      const index = datas.findIndex(d => d[key] === value);
      let delta = 0;
      if (this.axisConfig) {
        delta = this.transValue(this.axisConfig.itemWidth / 2);
      }
      xDis = yDis = this.band * index + delta;
    } else {
      const percent = (value - this.range[0]) / (this.range[1] - this.range[0]);
      xDis = this.dimensions.width * percent;
      if (isReverse) {
        xDis = this.dimensions.width - xDis;
      }
      yDis = this.dimensions.height * percent;
      if (isReverse) {
        yDis = this.dimensions.height - yDis;
      }
    }
    return {
      x: this.dimensions.x + xDis,
      y: this.dimensions.y + yDis
    };
  }

  renderChart() { }

  render() {
    const { x, y, width, height } = this.prevDimensions || this.dimensions;
    this.ctx.clearRect(x, y, width, height);
    this.renderChart();
    this.yAxis.forEach(axis => {
      if (axis.axisConfig.mode === 'inside') {
        axis.render();
      }
    });
    this.prevDimensions = { ...this.dimensions };
  }
}

export default Chart;