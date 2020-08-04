export default function min(values, key?) {
  let min;
  let max;
  for (let i = 0; i < values.length; i++) {
    let v;
    if (key) {
      if (Array.isArray(key)) {
        v = key.map(k => values[i][k]).filter(d => d !== undefined);
      } else {
        v = values[i][key];
      }
    } else {
      v = values[i];
    }
    if (v === null || v === undefined) continue;
    if (Array.isArray(v)) {
      min = min === undefined ? Math.min(...v) : Math.min(min, ...v);
      max = max === undefined ? Math.max(...v) : Math.max(max, ...v);
    } else {
      if (min === undefined || v < min) {
        min = v;
      }
      if (max === undefined || v > max) {
        max = v;
      }
    }
  }
  return [min, max];
}