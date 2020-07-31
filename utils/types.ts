export interface Config {
  type?: string;
  width?: number;
  height?: number;
  font?: string;
  window?: number;
  sort?: boolean;
  sortKey?: string;
  pie?: PieConfig;
  xAxis?: Array<XAxis>;
  yAxis?: Array<YAxis>;
  line?: Line;
}

interface PieConfig {
  radius: number;
  inner: PieConfigInner;
  labelOffset: number;
  label: PieConfigLabel;
  startAngle: number;
  totalAngle: number;
  animation: boolean;
}

interface PieConfigInner {
  radius: number
  color: string
}

interface PieConfigLabel {
  show: boolean;
  lineLength: number;
}

export interface ChartInfo {
  width?: number;
  height?: number;
  [key: string]: any;
}

interface MapNumber {
  [key: string]: number;
}

interface Section {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface AxisLabel {
  show: boolean;
  color: string | Function;
  format: null | Function | string;
  offset: number;
}

interface AxisTick {
  show: boolean;
  num: number;
  len: number;
  color: string | Function;
}

interface Grid {
  show: boolean;
  color: string;
}

interface Padding {
  top?: number;
  right?: number;
  bottom?: number;
  left?: number;
}

export interface XAxis {
  show?: boolean;
  position?: string;
  scalable?: boolean;
  key?: string;
  sort?: boolean;
  color?: string;
  lineWidth?: number;
  label?: AxisLabel;
  tick?: AxisTick;
  padding?: Padding;
}

export interface YAxis {
  show?: boolean;
  position?: string;
  sort?: boolean;
  color?: string;
  lineWidth?: number;
  label?: AxisLabel;
  tick?: AxisTick;
  padding?: Padding;
  dataPadding?: number;
}

interface Line {
  lines?: Array<Lines>;
  grid?: Grid;
}

interface Lines {
  color?: string;
  width?: number;
  area?: Area;
}

interface Area {
  show?: boolean;
  color?: string;
}