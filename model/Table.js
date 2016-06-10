var staticProps = require('static-props')

/**
 * An OLAP cube table is a multidimensional array of data.
 * It extends an ordinary table by adding dimensions that are
 * nothing more than special fields. If in a flat database table
 * you find many cell values repeating, for example
 *
 * year | month | revenue
 * 2016 | Gen   | 100
 * 2016 | Feb   | 170
 * ...
 *
 * probably it is a dimension and you don't need to repeat it on
 * each row.
 */

class Table {
  /**
   *
   * ```
   * var table = new Table({
   *   dimensions: [ 'year', 'month' ],
   *   points: [ [2016, 'Gen'], [2016, 'Feb'], [2016, 'Mar'] ],
   *   fields: ['revenue'],
   *   data: [[[100]], [[170]], [[280]]]
   * })
   * ```
   *
   * @param {Object} arg
   * @param {Array} arg.dimensions
   * @param {Array} arg.points
   * @param {Array} arg.fields
   * @param {Array} arg.data
   */
  constructor (arg) {
    // Assign default arguments.

    var {
      dimensions,
      points,
      fields,
      data
    } = Object.assign({
      dimensions: [],
      points: [[]],
      fields: [],
      data: [[[]]]
    }, arg)

    // Check arguments are consistent with multidim table structure.

    var invalidPoints = points.filter((p) => p.length !== dimensions.length)
    if (invalidPoints.length > 0) throw new TypeError('invalid points', invalidPoints)

    if (data.length !== points.length) throw new TypeError('orphan slices')

    var tableHasData = data.length.length > 0

    if (tableHasData) {
      var invalidSlices = data.filter((slice) => slice.length !== fields.length)
      if (invalidSlices.length > 0) throw new TypeError('invalid slices', invalidSlices)
    }

    var enumerable = true
    staticProps(this)({ dimensions, fields }, enumerable)
    staticProps(this)({ points, data })
  }
}

module.exports = Table
