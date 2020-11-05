import _ from 'lodash';
import Chart from './chart';
import EventTypes from '../utils/events';
import pick from '../utils/pick';
import { XAxis as XAxisConfig } from '../utils/types';
import { ChartType } from '../utils/chart';

class XAxis extends Chart {
  type = ChartType.xAxis;
  data = [];
  band = 0;
  axisConfig: XAxisConfig = {};

  constructor(config) {
    super();
    this.init(config);
  }

  setConfig(c = {}) {
    this.axisConfig = _.merge({}, this.axisConfig, c);
  }

  setData(data, originData?) {
    this.data = data;
    this.originData = originData;
    this.calcDimensions();
  }

  formatData(data) {
    this.data = data;
  }

  calcHeight() {
    const xAxis = this.axisConfig;
    let height = 0;
    if (xAxis.show) {
      height += this.transValue(xAxis.line.width < 1 ? 1 : xAxis.line.width);
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
    }
    let y;
    if (xAxis.position === 'bottom') {
      y = this.chartInfo.height - height;
    } else {
      y = 0;
    }
    if (height !== this.dimensions.height || y !== this.dimensions.y) {
      this.dimensions.height = height;
      this.dimensions.y = y;
      this.emit(EventTypes.UPDATE_CHART_INFO, {
        [this.id]: {
          height,
          y
        }
      }, this.id);
    }
  }

  calcDimensions() {
    this.calcHeight();
    let arr = [];
    let { width, height, ...rest } = this.chartInfo;
    let keys = Object.keys(rest);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
      if (key !== this.id) {
        arr.push(this.chartInfo[key]);
      }
    }
    arr.sort((a, b) => a.x - b.x);
    arr = arr.map(v => [v.x, v.x + v.width]);
    const d = pick(arr, 0, width);
    this.dimensions.x = d[0];
    this.dimensions.width = d[1] - d[0];
    this.calcBand();
    this.render();
  }

  calcBand() {
    let len = (this.data[0] && this.data[0].length) || 2;
    const conf = this.axisConfig;
    this.band = (this.dimensions.width - this.transValue(conf.itemWidth)) / (len - 1);
  }

  renderLine() {
    const xAxis = this.axisConfig;
    if (!xAxis.line.show) return;
    const { x, y, width } = this.dimensions;
    let lineWidth = this.transValue(xAxis.line.width);
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(x, y + lineWidth / 2);
    this.ctx.lineTo(x + width, y + lineWidth / 2);
    this.ctx.strokeStyle = xAxis.line.color;
    this.ctx.lineWidth = lineWidth;
    this.ctx.stroke();
    this.ctx.restore();
  }

  getInterval() {
    const xAxis = this.axisConfig;
    let num = xAxis.tick.num;
    if (xAxis.tick.num < 2) {
      num = 2;
    } else if (xAxis.tick.num > this.data[0].length) {
      num = this.data[0].length + 1;
    }
    return Math.floor(this.data[0].length / (num - 1));
  }

  bus(cb) {
    if (typeof cb !== 'function') return;
    const interval = this.getInterval();
    this.data[0].forEach((d, index) => {
      if (index % interval === 0 || index === this.data[0].length - 1) {
        cb(d, index);
      }
    });
  }

  renderGrid(c?, otherChartDimensions?) {
    if (!c || !otherChartDimensions) return;
    const { y, height } = otherChartDimensions;
    this.bus((data, index) => {
      this.ctx.save();
      this.ctx.beginPath();
      const x = this.dimensions.x + index * this.band + this.transValue(this.axisConfig.itemWidth / 2);
      this.ctx.moveTo(x, y);
      if (c.dashLine) {
        this.ctx.setLineDash([8, 8]);
      }
      this.ctx.lineTo(x, y + height);
      this.ctx.strokeStyle = c.color;
      this.ctx.stroke();
      this.ctx.restore();
    });
  }

  renderLabel() {
    const xAxis = this.axisConfig;
    if (!xAxis.label.show && !xAxis.tick.show) return;
    this.bus((d, index) => {
      if (xAxis.tick.show) {
        this.renderTick(d, index);
      }
      if (xAxis.label.show) {
        this.renderLabelText(d, index);
      }
    });
  }

  renderTick(data, index) {
    const xAxis = this.axisConfig;
    const { x, y, width } = this.dimensions;
    this.ctx.save();
    this.ctx.beginPath();
    let tickX = x + index * this.band + this.transValue(xAxis.itemWidth / 2);
    if (tickX <= x) {
      tickX += this.transValue(1 / 2);
    } else if (tickX >= x + width) {
      tickX -= this.transValue(1 / 2);
    }
    this.ctx.moveTo(tickX, y);
    this.ctx.lineTo(tickX, y + this.transValue(xAxis.tick.len));
    let strokeStyle;
    if (typeof xAxis.tick.color === 'function') {
      strokeStyle = xAxis.tick.color(data);
    } else {
      strokeStyle = xAxis.tick.color;
    }
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.stroke();
    this.ctx.restore();
  }

  renderLabelText(data, index) {
    const xAxis = this.axisConfig;
    const { x, y } = this.dimensions;
    let textAlign: CanvasTextAlign = 'center';
    if (!xAxis.itemWidth || !xAxis.itemCenter) {
      if (index === 0) {
        textAlign = 'left';
      } else if (index === this.data[0].length - 1) {
        textAlign = 'right';
      }
    }
    this.ctx.save();
    let fillStyle;
    let text = data[xAxis.key];
    if (typeof xAxis.label.color === 'function') {
      fillStyle = xAxis.label.color(text);
    } else {
      fillStyle = xAxis.label.color;
    }
    if (typeof xAxis.label.format === 'function') {
      text = xAxis.label.format(text);
    }
    this.ctx.fillStyle = fillStyle;
    let labelY = y + this.transValue(xAxis.label.offset);
    if (xAxis.tick.show) {
      labelY += this.transValue(xAxis.tick.len);
    }
    this.ctx.textAlign = textAlign;
    this.ctx.textBaseline = 'top';
    this.ctx.font = this.font;
    this.ctx.fillText(text, x + index * this.band + this.transValue(xAxis.itemWidth / 2), labelY);
    this.ctx.restore();
  }

  renderCross({ index, x, y }) {
    this.render();
    const d = this.data[0][index];
    const xAxis = this.axisConfig;
    this.ctx.save();
    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'center';
    let text = d[xAxis.key];
    if (typeof xAxis.label.format === 'function') {
      text = xAxis.label.format(text);
    }
    this.ctx.font = this.font;
    let labelWidth = this.ctx.measureText(text).width;
    labelWidth += this.transValue(10);
    let labelHeight = this.transValue(18);
    let labelX = x - labelWidth / 2;
    if (labelX < this.dimensions.x) {
      labelX = this.dimensions.x + 1;
    } else if (labelX + labelWidth > this.dimensions.x + this.dimensions.width) {
      labelX = this.dimensions.x + this.dimensions.width - labelWidth - 1;
    }
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(labelX, this.dimensions.y, labelWidth, labelHeight);
    this.ctx.fillStyle = '#fff';
    this.ctx.font = this.font;
    this.ctx.fillText(text, labelX + labelWidth / 2, this.dimensions.y + labelHeight / 2);
    this.ctx.restore();
  }

  onMouseLeave = () => {
    this.render();
  };

  render() {
    const { x, y, width, height } = this.prevDimensions || this.dimensions;
    this.ctx.clearRect(x, y, width, height);
    this.prevDimensions = { ...this.dimensions };
    const xAxis = this.axisConfig;
    if (this.data.length && xAxis.show) {
      this.renderLine();
      this.renderLabel();
    }
  }

  // render = _.debounce(this._render, 300);
}

export default XAxis;