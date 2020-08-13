export const gcolor = ({ context, x1, y1, x2, y2, colorStop, color = 'black', type = 'line' }: GcolorParams) => {
  if (!context) return;
  const grd = context.createLinearGradient(
    x1,
    y1,
    x2,
    y2
  );
  color = [].concat(color);
  const len = (color.length - 1) || 1;
  const interval = 1 / len;
  if (!colorStop) {
    colorStop = color.map((c, index) => {
      return index * interval;
    });
  }
  colorStop.forEach((stop, index) => {
    grd.addColorStop(stop, color[index]);
  });
  return grd;
};

export interface GcolorParams {
  context?: CanvasRenderingContext2D;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  colorStop?: Array<number>;
  color?: string | Array<string>;
  type?: string
};