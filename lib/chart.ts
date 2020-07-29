import { EventEmitter } from 'events';
import { Config, ChartInfo } from '../utils/types';
import { v4 } from 'uuid';

class Chart extends EventEmitter {
  id = '';
  ratio = 1;
  textLineHeight = 12;
  fontSize = 12;
  canvas = null;
  ctx: CanvasRenderingContext2D = null;
  config: Config = {};
  chartInfo: ChartInfo = {};

  constructor({ font = '12pt' } = {}) {
    super();
    this.id = v4();
    this.ratio = window.devicePixelRatio || 1;
    const fontSize = parseInt(font.match(/\d+/).join(), 10);
    this.fontSize = fontSize;
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
}

export default Chart;