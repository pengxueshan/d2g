import _ from 'lodash';
import Chart from './chart';
import EventTypes from '../utils/events';
import pick from '../utils/pick';
import minmax from '../utils/minmax';
import max from '../utils/max';
import { YAxis as YAxisConfig } from '../utils/types';
import { ChartType } from '../utils/chart';

class YAxis extends Chart {
  type = ChartType.yAxis;
  data = [];
  dimensions = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };
  prevDimensions = null;
  labels = [];
  range = [];
  axisConfig: YAxisConfig = {};

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
    this.axisConfig = _.merge({}, this.axisConfig, c);
  }

  setData(data, originData?) {
    this.data = data;
    this.originData = originData;
    this.calcLabels();
    this.calcDimensions();
  }

  formatData(data) {
    this.data = data;
  }

  calcWidth() {
    const yAxis = this.axisConfig;
    let width = 0;
    if (yAxis.show && yAxis.mode !== 'inside') {
      width += this.transValue(yAxis.line.width < 1 ? 1 : yAxis.line.width);
      if (yAxis.tick.show) {
        width += this.transValue(yAxis.tick.len);
      }
      if (yAxis.label.show) {
        const labelWidths = this.labels.map(v => {
          const t = v.formated !== undefined ? v.formated : v.label;
          return this.ctx.measureText(t).width;
        });
        width += max(labelWidths) || 0;
        width += this.transValue(yAxis.label.offset);
      }
      if (yAxis.padding.left) {
        width += this.transValue(yAxis.padding.left);
      }
      if (yAxis.padding.right) {
        width += this.transValue(yAxis.padding.right);
      }
    }
    let x;
    if (yAxis.position === 'left') {
      x = 0;
    } else {
      x = this.chartInfo.width - width;
    }
    if (width !== this.dimensions.width || x !== this.dimensions.x) {
      this.dimensions.width = width;
      this.dimensions.x = x;
      this.emit(EventTypes.UPDATE_CHART_INFO, {
        [this.id]: {
          width,
          x
        }
      }, this.id);
    }
  }

  calcHeight() {
    let arr = [];
    let { width, height, ...rest } = this.chartInfo;
    let keys = Object.keys(rest);
    for (let i = 0; i < keys.length; i++) {
      let key = keys[i];
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

  calcLabels() {
    const yAxis = this.axisConfig;
    let [min, max] = minmax(_.flatten(this.data), yAxis.key);
    const total = max - min;
    min = min - total * yAxis.dataPadding;
    max = max + total * yAxis.dataPadding;
    this.range = [min, max];
    const num = yAxis.tick.num < 2 ? 2 : yAxis.tick.num;
    const interval = (max - min) / (num - 1);
    this.labels = [];
    while (this.labels.length < num) {
      let v = min + this.labels.length * interval;
      if (v > max) {
        v = max;
      }
      let formated = this.formatValue(v);
      if (typeof yAxis.label.format === 'function') {
        formated = yAxis.label.format(v);
      }
      this.labels.push({
        label: v.toFixed(2),
        formated
      });
    }
  }

  formatValue(v) {
    return v.toFixed(2);
  }

  calcDimensions() {
    this.calcHeight();
    this.calcWidth();
    this.render();
  }

  renderLine() {
    const { x, y, width, height } = this.dimensions;
    const yAxis = this.axisConfig;
    if (!yAxis.line.show) return;
    let lineX;
    let lineWidth = this.transValue(yAxis.line.width);
    if ((yAxis.position === 'left' && yAxis.mode !== 'inside') || (yAxis.position === 'right' && yAxis.mode === 'inside')) {
      lineX = x + width - lineWidth / 2;
    } else {
      lineX = x + lineWidth / 2;
    }
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(lineX, y);
    this.ctx.lineTo(lineX, y + height);
    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = yAxis.line.color;
    this.ctx.stroke();
    this.ctx.restore();
  }

  renderGrid(c?, otherChartDimensions?) {
    if (!c || !otherChartDimensions) return;
    const { x, width } = otherChartDimensions;
    this.labels.forEach((label, index) => {
      const p = this.point(null, +label.formated || +label.label, true);
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(x, p.y);
      this.ctx.lineTo(x + width, p.y);
      this.ctx.strokeStyle = c.color;
      this.ctx.stroke();
      this.ctx.restore();
    });
  }

  renderLabel() {
    const yAxis = this.axisConfig;
    if (!yAxis.label.show && !yAxis.tick.show) return;
    this.labels.forEach((label, index) => {
      const p = this.point(null, +label.formated || +label.label, true);
      let tickX;
      let labelX;
      if ((yAxis.position === 'left' && yAxis.mode !== 'inside') || (yAxis.position === 'right' && yAxis.mode === 'inside')) {
        tickX = this.dimensions.x + this.dimensions.width - this.transValue(yAxis.tick.len);
        labelX = this.dimensions.x + this.dimensions.width;
      } else {
        tickX = this.dimensions.x;
        labelX = this.dimensions.x;
      }
      if (yAxis.tick.show) {
        this.renderTick({ x: tickX, y: p.y }, label);
      }
      if (yAxis.label.show) {
        this.renderLabelText({ x: labelX, y: p.y }, label, index);
      }
    });
  }

  renderTick(point, label) {
    const yAxis = this.axisConfig;
    const { y, height } = this.dimensions;
    let tickY = point.y;
    if (tickY <= y) {
      tickY += this.transValue(1) / 2;
    } else if (tickY >= y + height) {
      tickY -= this.transValue(1) / 2;
    }
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(point.x, tickY);
    this.ctx.lineTo(point.x + this.transValue(yAxis.tick.len), tickY);
    if (typeof yAxis.tick.color === 'function') {
      this.ctx.strokeStyle = yAxis.tick.color(label);
    } else {
      this.ctx.strokeStyle = yAxis.tick.color;
    }
    this.ctx.stroke();
    this.ctx.restore();
  }

  renderLabelText(point, label, index) {
    const yAxis = this.axisConfig;
    this.ctx.save();
    if (index === 0) {
      this.ctx.textBaseline = 'bottom';
    } else if (index === this.labels.length - 1) {
      this.ctx.textBaseline = 'top';
    } else {
      this.ctx.textBaseline = 'middle';
    }
    let x = point.x;
    if ((yAxis.position === 'left' && yAxis.mode !== 'inside') || (yAxis.position === 'right' && yAxis.mode === 'inside')) {
      this.ctx.textAlign = 'end';
      x = x - this.transValue(yAxis.label.offset);
      if (yAxis.tick.show) {
        x = x - this.transValue(yAxis.tick.len);
      }
    } else {
      this.ctx.textAlign = 'start';
      x = x + this.transValue(yAxis.label.offset);
      if (yAxis.tick.show) {
        x = x + this.transValue(yAxis.tick.len);
      }
    }
    if (typeof yAxis.label.color === 'function') {
      this.ctx.fillStyle = yAxis.label.color(label);
    } else {
      this.ctx.fillStyle = yAxis.label.color;
    }
    this.ctx.fillText(label.formated || label.label, x, point.y);
    this.ctx.restore();
  }

  renderCross({ value, x, y }) {
    this.render();
    const yAxis = this.axisConfig;
    this.ctx.save();
    this.ctx.textBaseline = 'middle';
    this.ctx.textAlign = 'center';
    let text = this.formatValue(value);
    if (typeof yAxis.label.format === 'function') {
      text = yAxis.label.format(value);
    }
    let labelWidth = this.ctx.measureText(text).width;
    labelWidth += this.transValue(10);
    let labelHeight = this.transValue(18);
    let labelX;
    if ((yAxis.position === 'left' && yAxis.mode !== 'inside') || (yAxis.position === 'right' && yAxis.mode === 'inside')) {
      labelX = this.dimensions.x + this.dimensions.width - labelWidth;
    } else {
      labelX = this.dimensions.x;
    }
    let labelY = y - labelHeight / 2;
    if (labelY < this.dimensions.y) {
      labelY = this.dimensions.y;
    } else if (labelY + labelHeight > this.dimensions.y + this.dimensions.height) {
      labelY = this.dimensions.y + this.dimensions.height - labelHeight;
    }
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(labelX, labelY, labelWidth, labelHeight);
    this.ctx.fillStyle = '#fff';
    this.ctx.fillText(text, labelX + labelWidth / 2, labelY + labelHeight / 2);
    this.ctx.restore();
  }

  onMouseLeave = () => {
    this.render();
  };

  render() {
    const { x, y, width, height } = this.prevDimensions || this.dimensions;
    this.ctx.clearRect(x, y, width, height);
    this.renderLine();
    this.renderLabel();
    this.prevDimensions = { ...this.dimensions };
  }

  // render = _.debounce(this._render, 300);
}

export default YAxis;