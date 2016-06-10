var test = require('tape')
var deepFreeze = require('deep-freeze')
var Table = require('olap-cube').model.Table

test('model Table', (t) => {
  var emptyTable = new Table()

  t.deepEqual(emptyTable.dimensions, [], 'dimensions defaults to []')
  t.deepEqual(emptyTable.points, [], 'points defaults to []')
  t.deepEqual(emptyTable.fields, [], 'fields defaults to []')
  t.deepEqual(emptyTable.data, [], 'data defaults to []')

  var table = new Table({
    dimensions: ['year', 'month'],
    fields: ['revenue'],
    points: [ [2016, 'Gen'], [2016, 'Feb'], [2016, 'Mar'] ],
    data: [[[100]], [[170]], [[280]]]
  })

  deepFreeze(table)

  t.deepEqual(table.structure, {
    dimensions: ['year', 'month'],
    fields: ['revenue']
  })

  t.end()
})
