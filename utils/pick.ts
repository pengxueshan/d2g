export default function pick(values: Array<Array<number>>, min: number, max: number) {
  if (values.length < 1) return [min, max];
  let arr = values.concat();
  // arr.sort((a, b) => a[0] - b[0]);
  let emptyArr: Array<Array<number>> = [];
  let restArr: Array<number> = [min, max];
  let ret: Array<number> = [0, 0];
  arr.forEach(v => {
    if (v[0] > restArr[1] || v[1] < restArr[0]) return;
    if (v[0] > restArr[0]) {
      emptyArr.push([restArr[0], v[0]]);
    }
    if (v[1] < restArr[1]) {
      restArr = [v[1], restArr[1]];
    } else {
      restArr = [max, max];
    }
  });
  emptyArr.push(restArr);
  emptyArr.forEach(v => {
    if ((v[1] - v[0]) > (ret[1] - ret[0])) {
      ret = [...v];
    }
  });
  return ret;
}
