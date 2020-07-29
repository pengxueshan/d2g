export default function max(values, key?) {
  let max;
  for (let i = 0; i < values.length; i++) {
    let v;
    if (key) {
      v = values[i][key];
    } else {
      v = values[i];
    }
    if (v === null || v === undefined) continue;
    if (max === undefined || v > max) {
      max = v;
    }
  }
  return max;
}