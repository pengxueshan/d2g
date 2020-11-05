export interface Config {
  type?: string;
  subType?: string;
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
  dashLine: boolean;
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
  line?: AxisLine;
  label?: AxisLabel;
  tick?: AxisTick;
  padding?: Padding;
  itemWidth?: number;
  itemCenter?: boolean;
}

export interface YAxis {
  show?: boolean;
  mode?: string;
  position?: string;
  sort?: boolean;
  line?: AxisLine;
  label?: AxisLabel;
  tick?: AxisTick;
  padding?: Padding;
  dataPadding?: DataPadding;
  key?: string | Array<string>;
}

interface DataPadding {
  top?: number;
  bottom?: number;
  start?: number;
}

interface AxisLine {
  color: string;
  show: boolean;
  width: number;
}

export interface Line {
  lines?: Array<Lines>;
  xGrid?: Grid;
  yGrid?: Grid;
  cross?: CrossLine;
}

interface CrossLine {
  show?: boolean;
}

interface Lines {
  color?: string;
  width?: number;
  area?: Area;
  type?: string;
  singleLabel?: SingleLabel;
  dot?: LineDot;
}

interface SingleLabel {
  show: boolean;
  position: string;
}

interface Area {
  show?: boolean;
  color?: string;
}

interface LineDot {
  show?: boolean;
  color?: string,
  radius?: number,
  width?: number,
  label?: LineDotLabel,
}

interface LineDotLabel {
  show?: boolean,
  color?: string,
}