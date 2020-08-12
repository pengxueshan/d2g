import { EventEmitter } from 'events';
import { Config, ChartInfo } from '../utils/types';
import { v4 } from 'uuid';

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
  range = [0, 0];
  band = 0;

  constructor({ font = '12px serif' } = {}) {
    super();
    this.id = v4();
    this.ratio = window.devicePixelRatio || 1;
    const fontSize = parseInt(font.match(/\d+/).join(), 10);
    this.fontSize = this.transValue(fontSize);
    this.font = font.replace(/(\d+)/, (m) => this.transValue(+m) + '');
    this.textLineHeight = this.transValue(fontSize);
  }

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

  value(point, isReverse = false) {
    const { x, y } = point;
    if (this.band) {
      const xDis = x - this.dimensions.x;
      let xIndex = Math.round(xDis / this.band);
      const yDis = y - this.dimensions.y;
      let yIndex = Math.round(yDis / this.band);
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
      xDis = yDis = this.band * index;
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
}

export default Chart;