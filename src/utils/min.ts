export default function min(values, key?) {
  let min;
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
  }
  return min;
}