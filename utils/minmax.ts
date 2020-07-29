export default function min(values, key) {
  let min;
  let max;
  for (let i = 0; i < values.length; i++) {
    let v;
    if (key) {
      v = values[i][key];
    } else {
      v = values[i];
    }
    if (v === null || v === undefined) continue;
    if (min === undefined || v < min) {
      min = v;
    }
    if (max === undefined || v > max) {
      max = v;
    }
  }
  return [min, max];
}