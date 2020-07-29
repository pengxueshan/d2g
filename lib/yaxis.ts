import _ from 'lodash';
import Chart from './chart';
import EventTypes from '../utils/events';
import pick from '../utils/pick';
import minmax from '../utils/minmax';
import max from '../utils/max';

class YAxis extends Chart {
  data = [];
  dimensions = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };
  labels = [];
  range = [];

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
    this.calcLabels();
    this.calcDimensions();
  }

  formatData(data) {
    this.data = data;
  }

  calcWidth() {
    const { yAxis } = this.config;
    let width = 0;
    width += this.transValue(yAxis.lineWidth < 1 ? 1 : yAxis.lineWidth);
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
    const { yAxis } = this.config;
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
    const [min, max] = minmax(this.data, 'value');
    this.range = [min, max];
    const { yAxis } = this.config;
    const num = yAxis.tick.num < 2 ? 2 : yAxis.tick.num;
    const interval = (max - min) / (num - 1);
    this.labels = [];
    while (this.labels.length < num) {
      let v = min + this.labels.length * interval;
      if (v > max) {
        v = max;
      }
      let formated = v;
      if (typeof yAxis.label.format === 'function') {
        formated = yAxis.label.format(v);
      }
      this.labels.push({
        label: v.toFixed(2),
        formated: formated
      });
    }
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
    this.render();
  }

  calcBand() { }

  renderLine() {
    const {x, y, width, height} = this.dimensions;
    const {yAxis} = this.config;
    let lineX;
    if (yAxis.position === 'left') {
      lineX = x + width - this.transValue(yAxis.lineWidth);
    } else {
      lineX = x;
    }
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(lineX, y);
    this.ctx.lineCap = 'square';
    this.ctx.lineTo(lineX, y + height);
    this.ctx.lineWidth = this.transValue(yAxis.lineWidth);
    this.ctx.strokeStyle = yAxis.color;
    this.ctx.stroke();
    this.ctx.restore();
  }

  _render() {
    const {x, y, width, height} = this.dimensions;
    this.ctx.clearRect(x, y, width, height);
    this.renderLine();
  }

  render = _.debounce(this._render, 300);
}

export default YAxis;