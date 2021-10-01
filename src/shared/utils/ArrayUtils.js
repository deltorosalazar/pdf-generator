class ArrayUtils {
  /**
   * Sums all the values of the array.
   * @param {Array<string|number>} array
   * @param {boolean} convertToInt
   * @returns {number}
   */
  static sumValues(array, convertToInt = true) {
    if (!array.length) return 0;

    const fn = convertToInt ? parseInt : parseFloat;

    return array.reduce((prev, curr) => {
      return fn(prev) + fn(curr);
    }, 0);
  }

  /**
   * Gets the average of the values of the array.
   * @param {*} array
   * @returns {number}
   */
  static getAverage(array) {
    return this.sumValues(array) / array.length;
  }
}

module.exports = ArrayUtils;
