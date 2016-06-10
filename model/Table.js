'use strict'

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
   * @param {Array} arg.data in the format data[pointIndex][fieldIndex]
   */
  constructor () {
    // Assign default arguments.

    const arg = Object.assign({
      dimensions: [],
      points: [[]],
      fields: [],
      data: [[[]]]
    }, arguments[0])

    const dimensions = arg.dimensions
    const points = arg.points
    const fields = arg.fields
    const data = arg.data

    // Check arguments are consistent with multidim table structure.

    var tableHasData = data.length.length > 0

    if (tableHasData) {
      var invalidSlices = data.filter((slice) => slice.length !== fields.length)
      if (invalidSlices.length > 0) throw new TypeError('invalid slices', invalidSlices)

      var invalidPoints = points.filter((p) => p.length !== dimensions.length)
      if (invalidPoints.length > 0) throw new TypeError('invalid points', invalidPoints)

      if (data.length !== points.length) throw new TypeError('orphan slices')
    }

    var enumerable = true
    staticProps(this)({ dimensions, fields }, enumerable)

    staticProps(this)({
      points,
      data,
      structure: { dimensions, fields }
    })
  }

  /**
   * Every row is an object whose keys are either a dimension or a field.
   *
   * @param {Array} rows
   */

  addRows (rows) {
    let data = Object.assign([], this.data)
    let points = Object.assign([], this.points)

    rows.forEach((row) => {
      let point = []
      let fields = []

      if (Object.keys(row).length !== (this.dimensions.length + this.points.length)) {
        throw new TypeError('invalid row', row)
      }

      for (let key in row) {
        let dimIndex = this.dimensions.indexOf(key)
        let fieldIndex = this.fields.indexOf(key)

        if (dimIndex > -1) {
          var dim = row[key]
          point.splice(dimIndex, 0, dim)
        } else if (fieldIndex > -1) {
          var field = row[key]
          fields.splice(fieldIndex, 0, field)
        } else {
          throw new TypeError('invalid row', row)
        }

        // TODO create a slice for every point added
        // points.push(point)
        // slice.push(fields)
        // data.push(slice)
      }
    })

    return new Table(
      Object.assign(
        {},
        this.structure,
        { data }
      )
    )
  }
}

module.exports = Table
