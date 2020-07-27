export interface Config {
  type?: string;
  width?: number;
  height?: number;
  pie?: PieConfig;
}

interface PieConfig {
  radius: number;
  inner: PieConfigInner;
  labelOffset: number;
  sort: boolean;
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
}