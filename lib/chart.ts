class Chart {
  ratio = 1;
  textLineHeight = 12;
  fontSize = 12;

  constructor({ fontSize = 12 } = {}) {
    this.ratio = window.devicePixelRatio || 1;
    this.fontSize = fontSize;
    this.textLineHeight = this.ratio * fontSize;
  }

  transValue(v, isToReal = true) {
    if (isToReal) {
      return v * this.ratio;
    } else {
      return v / this.ratio;
    }
  }

  /**
   * @param (Array) dest [x1, x2, y1, y2]
   */
  checkIsCover(dest, src) {
    return !(src[2] >= dest[3] || src[3] <= dest[2] || src[0] >= dest[1] || src[1] <= dest[0]);
  }
}

export default Chart;