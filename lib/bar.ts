import _ from 'lodash';
import Chart from './chart';
import { Line as LineType } from '../utils/types';
import { ChartType } from '../utils/chart';

class Bar extends Chart {
  type = ChartType.line;
  data = [];
  lineConfig: LineType = {}

  constructor(config, xAxis, yAxis) {
    super();
    this.xAxis = xAxis;
    this.yAxis = yAxis;
    this.init(config);
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

  onMouseMove = (p) => {
  };

  onMouseLeave = () => {
  };

  renderChart() {
    this.data.forEach((data, index) => {
      const xAxis = this.xAxis[index];
      const yAxis = this.yAxis[index];
      const xKey = xAxis.axisConfig.key;
      let yKey = yAxis.axisConfig.key;
      if (typeof yKey !== 'string') {
        yKey = yKey.toString();
      }
      const barWidth = this.transValue(xAxis.axisConfig.itemWidth);
      data.forEach(d => {
        const x = xAxis.point(data, d[xKey], false, xKey).x;
        const y = yAxis.point(data, d[yKey], true).y;
        this.ctx.save();
        this.ctx.fillRect(x, y, barWidth, this.dimensions.y + this.dimensions.height - y);
        this.ctx.restore();
      });
    });
  }
}

export default Bar;