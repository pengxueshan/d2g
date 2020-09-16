export default function style(styleObj) {
  let ret = '';
  for (const key in styleObj) {
    ret += `${key}:${styleObj[key]};`;
  }
  return ret;
}