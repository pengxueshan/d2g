import _ from 'lodash';
import Chart from './chart';
import EventTypes from '../utils/events';
import pick from '../utils/pick';

class XAxis extends Chart {
  data = [];
  dimensions = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };
  band = 0;

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
    this.calcDimensions();
  }

  formatData(data) {
    this.data = data;
  }

  calcHeight() {
    const { xAxis } = this.config;
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
    const { xAxis } = this.config;
    if (!xAxis.show) {
      this.dimensions.x = 0;
      this.dimensions.y = 0;
      this.dimensions.width = 0;
      this.dimensions.height = 0;
      return;
    }
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
    this.band = this.dimensions.width / ((this.data.length || 2) - 1);
  }

  renderLine() {
    const { xAxis } = this.config;
    const { x, y, width } = this.dimensions;
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    // this.ctx.lineCap = 'square';
    this.ctx.lineTo(x + width, y);
    this.ctx.strokeStyle = xAxis.color;
    this.ctx.lineWidth = this.transValue(xAxis.lineWidth);
    this.ctx.stroke();
    this.ctx.restore();
  }

  renderLabel() {
    const { xAxis } = this.config;
    if (!xAxis.label.show && !xAxis.tick.show) return;
    let num = xAxis.tick.num;
    if (xAxis.tick.num < 2) {
      num = 2;
    } else if (xAxis.tick.num > this.data.length) {
      num = this.data.length + 1;
    }
    const interval = Math.floor(this.data.length / (num - 1));
    this.data.forEach((d, index) => {
      if (index % interval === 0 || index === this.data.length - 1) {
        if (xAxis.tick.show) {
          this.renderTick(d, index);
        }
        if (xAxis.label.show) {
          this.renderLabelText(d, index);
        }
      }
    });
  }

  renderTick(data, index) {
    const { xAxis } = this.config;
    const { x, y } = this.dimensions;
    let delta = 0;
    if (index === 0) {
      delta = this.transValue(xAxis.lineWidth);
    } else if (index === this.data.length - 1) {
      delta = -this.transValue(xAxis.lineWidth);
    }
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(x + index * this.band + delta, y);
    this.ctx.lineCap = 'square';
    this.ctx.lineTo(x + index * this.band + delta, y + this.transValue(xAxis.tick.len));
    let strokeStyle;
    if (typeof xAxis.tick.color === 'function') {
      strokeStyle = xAxis.tick.color(data);
    } else {
      strokeStyle = xAxis.tick.color;
    }
    this.ctx.lineWidth = this.transValue(xAxis.lineWidth);
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.stroke();
    this.ctx.restore();
  }

  renderLabelText(data, index) {
    const { xAxis } = this.config;
    const { x, y } = this.dimensions;
    let textAlign = 'center';
    if (index === 0) {
      textAlign = 'left';
    } else if (index === this.data.length - 1) {
      textAlign = 'right';
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
    this.ctx.fillText(text, x + index * this.band, labelY);
    this.ctx.restore();
  }

  _render() {
    const { x, y, width, height } = this.dimensions;
    this.ctx.clearRect(x, y, width, height);
    this.renderLine();
    this.renderLabel();
  }

  render = _.debounce(this._render, 300);
}

export default XAxis;