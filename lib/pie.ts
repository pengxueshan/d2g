import _ from 'lodash';
import Chart from './chart';
import colors from '../utils/colors.json';
import sum from '../utils/sum';

class Pie extends Chart {
  outerRadius = 0;
  innerRadius = 0;
  labelRadius = 0;
  data = [];
  _labelPositions = [];
  _totalAngle = 0;
  _isAnimation = false;

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
    const { pie } = this.config;
    if (pie.radius <= 1) {
      this.outerRadius = Math.min(this.chartInfo.width, this.chartInfo.height) * pie.radius / 2;
    } else {
      this.outerRadius = this.transValue(pie.radius);
    }
    this.labelRadius = this.outerRadius + this.transValue(pie.labelOffset);
    if (pie.inner.radius <= 1) {
      this.innerRadius = this.outerRadius * pie.inner.radius;
    } else {
      this.innerRadius = pie.inner.radius;
    }
  }

  setData(data) {
    this.data = this.formatData(data);
    this.render();
  }

  formatData(data) {
    const total = sum(data, 'value');
    const { pie, sort } = this.config;
    let ret = data.map(d => {
      let label = d.label;
      const percent = d.value / total;
      if (!label) {
        label = (percent * 100).toFixed(2) + '%';
      }
      return {
        ...d,
        percent,
        label
      };
    });
    return ret;
  }

  getCenterPoint() {
    return {
      x: this.chartInfo.width / 2,
      y: this.chartInfo.height / 2
    };
  }

  renderOuter() {
    const { x, y } = this.getCenterPoint();
    const { pie } = this.config;
    let start = {
      x,
      y: y - this.outerRadius * Math.sin(pie.startAngle)
    };
    let startAngle = pie.startAngle;
    this.data.forEach(pieData => {
      const deltaAngle = pieData.percent * pie.totalAngle;
      const endAngle = startAngle + deltaAngle;
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(start.x, start.y);
      this.ctx.arc(x, y, this.outerRadius, startAngle, endAngle, false);
      this.ctx.closePath();
      this.ctx.fillStyle = pieData.color;
      this.ctx.fill();
      this.ctx.restore();
      start.x = x + this.outerRadius * Math.cos(endAngle);
      start.y = y + this.outerRadius * Math.sin(endAngle);
      startAngle = endAngle;
      if (!this._isAnimation && pie.label.show) {
        this.renderLabel(endAngle - deltaAngle / 2, pieData);
      }
    });
  }

  renderInner() {
    const { x, y } = this.getCenterPoint();
    const radius = this.innerRadius;
    const { pie } = this.config;
    let start = {
      x,
      y: y - this.innerRadius * Math.sin(pie.startAngle)
    };
    this.ctx.save();
    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    this.ctx.lineTo(start.x, start.y);
    this.ctx.arc(x, y, radius, pie.startAngle, pie.startAngle + pie.totalAngle);
    this.ctx.closePath();
    this.ctx.fillStyle = pie.inner.color;
    this.ctx.fill();
    this.ctx.restore();
  }

  renderLabel(labelAngle, data) {
    let { x, y } = this.getCenterPoint();
    let labelX = x + this.labelRadius * Math.cos(labelAngle);
    let labelY = y + this.labelRadius * Math.sin(labelAngle);
    let sign = 1;
    if (labelX < x) {
      sign = -1;
    }
    let labelPositionXRange = [];
    let textWidth = this.ctx.measureText(data.label).width;
    if (sign > 0) {
      labelPositionXRange = [labelX, labelX + textWidth];
    } else {
      labelPositionXRange = [labelX - textWidth, labelX];
    }
    let labelPositionYRange = [labelY - this.textLineHeight / 2, labelY + this.textLineHeight / 2];
    let positionRange = [...labelPositionXRange, ...labelPositionYRange];
    if (this._labelPositions && this._labelPositions.length) {
      for (let i = 0; i < this._labelPositions.length; i++) {
        let comparedPosition = this._labelPositions[i];
        if (this.checkIsCover(comparedPosition, positionRange)) {
          let prevPosY = comparedPosition[3] - this.textLineHeight / 2;
          let prevAngel = Math.asin((prevPosY - y) / this.labelRadius);
          if (labelX < x) {
            prevAngel = Math.PI - prevAngel;
          }
          let angel;
          let count = 1;
          do {
            angel = prevAngel + (count * Math.PI) / 60;
            labelX = x + this.labelRadius * Math.cos(angel);
            labelY = y + this.labelRadius * Math.sin(angel);
            if (labelX < x) {
              sign = -1;
            }
            if (sign > 0) {
              labelPositionXRange = [labelX, labelX + textWidth];
            } else {
              labelPositionXRange = [labelX - textWidth, labelX];
            }
            labelPositionYRange = [labelY - this.textLineHeight / 2, labelY + this.textLineHeight / 2];
            positionRange = [...labelPositionXRange, ...labelPositionYRange];
            count++;
          } while (angel < Math.PI * 2 && this.checkIsCover(comparedPosition, positionRange));
        } else {
          continue;
        }
      }
    }
    if (!this._labelPositions) {
      this._labelPositions = [];
    }
    this._labelPositions.push(positionRange);
    let outerCenterPoint = {
      x: x + this.outerRadius * Math.cos(labelAngle),
      y: y + this.outerRadius * Math.sin(labelAngle)
    };
    const { pie } = this.config;
    let endLinePoint = {
      x: labelX + sign * this.transValue(pie.label.lineLength),
      y: labelY
    };
    let endTextPoint = {
      x: labelX + sign * this.transValue(pie.label.lineLength + 5),
      y: labelY
    };
    this.ctx.save();
    this.ctx.beginPath();
    this.ctx.moveTo(outerCenterPoint.x, outerCenterPoint.y);
    this.ctx.lineTo(labelX, labelY);
    this.ctx.lineTo(endLinePoint.x, endLinePoint.y);
    this.ctx.strokeStyle = data.color || colors.black;
    this.ctx.stroke();
    this.ctx.fillStyle = data.color || colors.black;
    this.ctx.textAlign = sign > 0 ? 'start' : 'end';
    this.ctx.textBaseline = 'middle';
    this.ctx.fillText(data.label, endTextPoint.x, endTextPoint.y);
    this.ctx.restore();
  }

  clear() {
    this.ctx.clearRect(0, 0, this.chartInfo.width, this.chartInfo.height);
  }

  render() {
    const { pie } = this.config;
    if (!pie.animation) {
      this.clear();
      this.renderOuter();
      this.renderInner();
    } else {
      this._totalAngle = pie.totalAngle;
      this.setConfig({
        pie: {
          totalAngle: 0
        }
      });
      this.animation();
    }
  }

  animation() {
    const { pie } = this.config;
    if (pie.totalAngle >= this._totalAngle) {
      this._isAnimation = false;
      this.clear();
      this.renderOuter();
      this.renderInner();
      return;
    }
    let t = pie.totalAngle + 0.2;
    if (t > this._totalAngle) {
      t = this._totalAngle;
    }
    this.setConfig({
      pie: {
        totalAngle: t
      }
    });
    this._isAnimation = true;
    this.clear();
    this.renderOuter();
    this.renderInner();
    requestAnimationFrame(() => {
      this.animation();
    });
  }
}

export default Pie;
