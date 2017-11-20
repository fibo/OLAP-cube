const no = require('not-defined')
const staticProps = require('static-props')

/**
 * OLAP table, a.k.a. cube of data.
 *
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
 *
 * @class
 */

class Table {
  /**
   * Create an OLAP table.
   *
   * ```
   * var table = new Table({
   *   dimensions: [ 'year', 'month' ],
   *   points: [ [2016, 'Gen'], [2016, 'Feb'], [2016, 'Mar'] ],
   *   fields: ['revenue'],
   *   data: [[100], [170], [280]]
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
      points: [],
      fields: [],
      data: []
    }, arguments[0])

    const dimensions = arg.dimensions
    const points = arg.points
    const fields = arg.fields
    const data = arg.data

    // Check arguments are consistent with multidim table structure.

    const tableHasData = data.length > 0

    if (tableHasData) {
      const invalidSlices = data.filter((slice) => slice.length !== fields.length)

      if (invalidSlices.length > 0) {
        throw new TypeError('invalid slices')
      }

      const invalidPoints = points.filter((p) => p.length !== dimensions.length)
      if (invalidPoints.length > 0) {
        throw new TypeError('invalid points')
      }

      if (data.length !== points.length) {
        throw new TypeError('orphan slices')
      }
    }

    // Set immutable attributes.

    const enumerable = true
    staticProps(this)({ dimensions, fields }, enumerable)

    staticProps(this)({
      points,
      data,
      structure: { dimensions, fields }
    })

    // Derived fields.

    staticProps(this)({
      header: () => this.dimensions.concat(this.fields),
      rows: () => this.points.map((p, i) => p.concat(this.data[i]))
    })
  }

  /**
   * Add a set of rows to the table.
   *
   * table.addRows({
   *   header: ['year', 'month', 'revenue'],
   *   rows: [
   *     [ 2016, 'Gen', 100 ],
   *     [ 2016, 'Feb', 170 ],
   *     [ 2016, 'Mar', 280 ]
   *   ]
   * })
   *
   * @param {Object} data
   * @param {Array} data.header
   * @param {Array} data.rows
   * @returns {Object} table
   */

  addRows (arg) {
    const header = arg.header
    const rows = arg.rows

    const dimensions = this.dimensions
    const fields = this.fields

    if (header.length !== (dimensions.length + fields.length)) {
      throw new TypeError('invalid header')
    }

    const data = [...this.data]
    const points = [...this.points]

    rows.forEach((row) => {
      let point = []
      let cells = []

      for (let i in row) {
        const key = header[i]
        let dimIndex = dimensions.indexOf(key)
        let fieldIndex = fields.indexOf(key)

        if (dimIndex > -1) {
          point.splice(dimIndex, 0, row[i])
        } else if (fieldIndex > -1) {
          cells.splice(fieldIndex, 0, row[i])
        } else {
          throw new TypeError('invalid row')
        }
      }

      let pointIndex = null
      points.forEach((p, index) => {
        if (p.filter((coord, i) => coord === point[i]).length === point.length) {
          // Found point.
          pointIndex = index
        }
      })

      if (pointIndex === null) {
        // No point was found, let's add it.
        pointIndex = points.length
        points.push(point)
      }

      data.splice(pointIndex, 0, cells)
    })

    return new Table(
      Object.assign({}, this.structure, { points, data })
    )
  }

  /**
   * Slice operator picks a rectangular subset of a cube by choosing a single value of its dimensions.
   *
   * @param {String} dimension
   * @param {*} filter
   * @returns {Object} table
   */

  slice (dimension, filter) {
    const structure = this.structure
    let points = []
    let data = []

    const dimensionIndex = structure.dimensions.indexOf(dimension)

    if (dimensionIndex === -1) {
      throw new TypeError('dimension not found', dimension)
    }

    this.points.forEach((point, i) => {
      // Add slice if it matches given filter.
      if (point[dimensionIndex] === filter) {
        data.push(this.data[i])
        points.push(this.points[i])
      }
    })

    return new Table(
      Object.assign({}, structure, { points, data })
    )
  }

  /**
   * Dice operator picks a subcube by choosing a specific values of multiple dimensions.
   *
   * @param {Function} selector
   * @returns {Object} table
   */

  dice (selector) {
    let points = []
    let data = []

    this.points.forEach((point, i) => {
      if (selector(point)) {
        data.push(this.data[i])
        points.push(this.points[i])
      }
    })

    return new Table(
      Object.assign({}, this.structure, { points, data })
    )
  }

  /**
   * A roll-up involves summarizing the data along a dimension.
   *
   * @param {String} dimension
   * @param {Array} fields
   * @param {Function} aggregator
   * @param {*} initialValue
   * @returns {Object} table
   */

  rollup (dimension, fields, aggregator, initialValue) {
    let points = []
    let dataObj = {}
    let rolledupData = []
    let seen = {}

    const dimensionIndex = this.structure.dimensions.indexOf(dimension)
    const numDimensions = this.structure.dimensions.length

    const structure = {
      dimensions: [dimension],
      fields
    }

    this.rows.forEach(row => {
      // Compute points that is an array of array of strings.
      const point = row[dimensionIndex]

      if (!seen[point]) {
        points.push([point])
        seen[point] = true
      }

      const fields = row.slice(numDimensions)

      if (no(dataObj[point])) dataObj[point] = []

      dataObj[point].push(fields)
    })

    points.forEach(point => {
      rolledupData.push(dataObj[point].reduce(aggregator, initialValue))
    })

    return new Table(
      Object.assign({}, structure, { points, data: rolledupData })
    )
  }
}

module.exports = Table
