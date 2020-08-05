import _ from 'lodash';
import Chart from './chart';
import pick from '../utils/pick';
import XAxis from './xaxis';
import YAxis from './yaxis';
import { Line as LineType } from '../utils/types';
import { ChartType } from '../utils/chart';
import minmax from '../utils/minmax';
import min from '../utils/min';
import max from '../utils/max';

class Line extends Chart {
  type = ChartType.line;
  data = [];
  xAxis: Array<XAxis> = null;
  yAxis: Array<YAxis> = null;
  dimensions = {
    x: 0,
    y: 0,
    width: 0,
    height: 0
  };
  prevDimensions = null;
  horizonLine = null;
  verticalLine = null;
  lineConfig: LineType = {}

  constructor(config, xAxis, yAxis) {
    super();
    this.xAxis = xAxis;
    this.yAxis = yAxis;
    this.init(config);
  }

  init(c) {
    const { wrap, canvas, ctx, config, chartInfo } = c;
    this.wrap = wrap;
    this.canvas = canvas;
    this.ctx = ctx;
    this.chartInfo = chartInfo;
    this.setConfig(config);
  }

  setConfig(c = {}) {
    this.lineConfig = _.merge({}, this.lineConfig, c);
  }

  setData(data, originData?) {
    this.data = data;
    this.originData = originData;
    this.render();
  }

  formatData(data) {
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

  renderLine() {
    const { lines } = this.lineConfig;
    let prevLineConfig;
    this.data.forEach((data, index) => {
      let conf = lines[index] || prevLineConfig;
      prevLineConfig = lines[index];
      if (conf.type === 'kline') {
        this.renderKLine(data, index);
      } else if (conf.type === 'singlex') {
        this.renderSingleX(index, conf);
      } else if (conf.type === 'singley') {
        this.renderSingleY(index, conf);
      } else {
        this.renderNaturalLine(data, index, conf);
      }
    });
  }

  renderNaturalLine(data, index, conf) {
    const points = data.map(d => {
      let x = 0;
      if (this.xAxis[0]) {
        let key = this.xAxis[0].axisConfig.key;
        x = this.xAxis[0].point(data, d[key], false, key).x;
      }
      let y = 0;
      if (this.yAxis[0]) {
        let key = this.yAxis[0].axisConfig.key;
        if (Array.isArray(key)) {
          key = 'value';
        }
        y = this.yAxis[0].point(data, d[key], true).y;
      }
      return { x, y };
    });
    const xpoints = points.map(p => p.x);
    const ypoints = points.map(p => p.y);
    const px = this.getCtrlPoint2(xpoints);
    const py = this.getCtrlPoint2(ypoints);
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    let minY = points[0].y;
    if (points.length === 2) {
      this.ctx.lineTo(points[1].x, points[1].y);
      minY = Math.min(minY, points[1].y);
    } else if (points.length > 2) {
      for (var i0 = 0, i1 = 1; i1 < points.length; ++i0, ++i1) {
        this.ctx.bezierCurveTo(px[0][i0], py[0][i0], px[1][i0], py[1][i0], xpoints[i1], ypoints[i1]);
        minY = Math.min(minY, py[0][i0], py[1][i0], ypoints[i1]);
      }
    }
    this.ctx.strokeStyle = conf.color;
    this.ctx.lineWidth = this.transValue(conf.width);
    this.ctx.stroke();
    if (conf.area.show) {
      const { x, y, width, height } = this.dimensions;
      this.ctx.lineTo(x + width, y + height);
      this.ctx.lineTo(x, y + height);
      this.ctx.closePath();
      if (Array.isArray(conf.area.color)) {
        if (conf.area.color.length < 2) {
          this.ctx.fillStyle = conf.area.color[0];
        } else {
          const grd = this.ctx.createLinearGradient(
            0,
            minY,
            0,
            this.dimensions.y + this.dimensions.height
          );
          let interval = 1 / (conf.area.color.length - 1);
          conf.area.color.forEach((color, index) => {
            grd.addColorStop(interval * index, color);
          });
          this.ctx.fillStyle = grd;
        }
      } else {
        this.ctx.fillStyle = conf.area.color;
      }
      this.ctx.fill();
    }
    this.ctx.restore();
  }

  renderKLine(line, index) {
    line.forEach((data, dataIndex) => {
      const key = this.xAxis[index].axisConfig.key;
      const { low, open, close, high, pclose } = data;
      const value = data[key];
      const barWidth = this.xAxis[0].band * 0.3;
      let x = this.xAxis[0].point(line, value, false, key).x;
      if (dataIndex === 0) {
        x += barWidth / 2;
      } else if (dataIndex === line.length - 1) {
        x -= barWidth / 2;
      }
      const lowY = this.yAxis[0].point(line, low, true).y;
      const highY = this.yAxis[0].point(line, high, true).y;
      const openY = this.yAxis[0].point(line, open, true).y;
      const closeY = this.yAxis[0].point(line, close, true).y;
      const [min, max] = minmax([openY, closeY]);
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(x - barWidth / 2, min);
      this.ctx.lineTo(x + barWidth / 2, min);
      this.ctx.lineTo(x + barWidth / 2, max);
      this.ctx.lineTo(x - barWidth / 2, max);
      this.ctx.lineTo(x - barWidth / 2, min);
      this.ctx.moveTo(x, highY);
      this.ctx.lineTo(x, min);
      this.ctx.moveTo(x, max);
      this.ctx.lineTo(x, lowY);
      let strokeStyle = 'red';
      if (close < pclose) {
        strokeStyle = 'green';
      }
      this.ctx.strokeStyle = strokeStyle;
      this.ctx.stroke();
      this.ctx.restore();
    });
  }

  renderSingleX(index, conf) {
    const d = this.originData[index][0];
    if (!d) return;
    const { x: dx, width, y, height } = this.dimensions;
    let x = 0;
    let labelText = '';
    if (this.xAxis[0]) {
      const key = this.xAxis[0].axisConfig.key;
      labelText = d[key];
      x = this.xAxis[0].point(this.originData[index], labelText, false, key).x;
      x = max([x, dx]);
      x = min([x, dx + width]);
    }
    let labelY;
    let textBaseLine;
    if (conf.singleLabel.position === 'top') {
      labelY = y;
      textBaseLine = 'top';
    } else {
      labelY = y + height;
      textBaseLine = 'bottom';
    }
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x, y + height);
    this.ctx.lineWidth = this.transValue(conf.width);
    this.ctx.strokeStyle = conf.color;
    this.ctx.stroke();
    this.ctx.textBaseline = textBaseLine;
    this.ctx.textAlign = 'end';
    this.ctx.fillStyle = conf.singleLabel.color || conf.color;
    this.ctx.fillText(labelText, x, labelY);
    this.ctx.restore();
  }

  renderSingleY(index, conf) {
    const d = this.originData[index][0];
    if (!d) return;
    const { x, width, y: dy, height } = this.dimensions;
    let y = 0;
    let labelText = '';
    if (this.yAxis[0]) {
      let key = this.yAxis[0].axisConfig.key;
      if (Array.isArray(key)) {
        key = 'value';
      }
      labelText = d[key];
      y = this.yAxis[0].point(this.originData[index], labelText, true).y;
      y = max([y, dy]);
      y = min([y, dy + height]);
    }
    let labelX;
    let textAlign;
    if (conf.singleLabel.position === 'right') {
      labelX = x + width;
      textAlign = 'end';
    } else {
      labelX = x;
      textAlign = 'start';
    }
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(x + width, y);
    this.ctx.lineWidth = this.transValue(conf.width);
    this.ctx.strokeStyle = conf.color;
    this.ctx.stroke();
    this.ctx.textAlign = textAlign;
    this.ctx.fillStyle = conf.singleLabel.color || conf.color;
    this.ctx.fillText(labelText, labelX, y - this.transValue(5));
    this.ctx.restore();
  }

  getCtrlPoint2(x) {
    var i,
      n = x.length - 1,
      m,
      a = new Array(n),
      b = new Array(n),
      r = new Array(n);
    a[0] = 0, b[0] = 2, r[0] = x[0] + 2 * x[1];
    for (i = 1; i < n - 1; ++i) a[i] = 1, b[i] = 4, r[i] = 4 * x[i] + 2 * x[i + 1];
    a[n - 1] = 2, b[n - 1] = 7, r[n - 1] = 8 * x[n - 1] + x[n];
    for (i = 1; i < n; ++i) m = a[i] / b[i - 1], b[i] -= m, r[i] -= m * r[i - 1];
    a[n - 1] = r[n - 1] / b[n - 1];
    for (i = n - 2; i >= 0; --i) a[i] = (r[i] - a[i + 1]) / b[i];
    b[n - 1] = (x[n] + a[n - 1]) / 2;
    for (i = 0; i < n - 1; ++i) b[i] = 2 * x[i + 1] - a[i + 1];
    return [a, b];
  }

  renderGrid() {
    const line = this.lineConfig;
    if (line.xGrid.show) {
      this.xAxis.forEach(c => {
        c.renderGrid(line.xGrid, this.dimensions);
      });
    }
    if (line.yGrid.show) {
      this.yAxis.forEach(c => {
        c.renderGrid(line.yGrid, this.dimensions);
      });
    }
  }

  renderCrossLine({ x, y }) {
    const line = this.lineConfig;
    if (!line.cross.show) return;
    this.render();
    const { x: dx, y: dy, width, height } = this.dimensions;
    x = x < dx ? dx : x;
    x = x > dx + width ? dx + width : x;
    y = y < dy ? dy : y;
    y = y > dy + height ? dy + height : y;
    this.xAxis.forEach(ax => {
      const { xIndex } = ax.value({ x, y });
      ax.renderCross({
        index: xIndex,
        x, y
      });
    });
    this.yAxis.forEach(ax => {
      const { y: yValue } = ax.value({ x, y }, true);
      ax.renderCross({
        value: yValue,
        x, y
      });
    });
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(dx, y);
    this.ctx.lineTo(dx + width, y);
    this.ctx.moveTo(x, dy);
    this.ctx.lineTo(x, dy + height);
    this.ctx.lineWidth = 1;
    this.ctx.stroke();
    this.ctx.restore();
  }

  onMouseMove = (p) => {
    this.renderCrossLine(p);
  };

  onMouseLeave = () => {
    this.render();
  };

  render() {
    const { x, y, width, height } = this.prevDimensions || this.dimensions;
    this.ctx.clearRect(x, y, width, height);
    this.renderGrid();
    this.renderLine();
    this.prevDimensions = { ...this.dimensions };
  }

  // render = _.debounce(this._render, 300);
}

export default Line;