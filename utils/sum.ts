export default function sum(values: Iterable<object | number>, key: string | undefined) {
  let total = 0;
  for (const v of values) {
    if (typeof v === 'object') {
      if (key) {
        total += +v[key] || 0;
      }
    } else {
      total += v;
    }
  }
  return total;
}