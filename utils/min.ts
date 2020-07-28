export default function min(values: Iterable<number>) {
  let min;
  for (const value of values) {
    if (value != null
      && (min > value || (min === undefined && value >= value))) {
      min = value;
    }
  }
  return min;
}