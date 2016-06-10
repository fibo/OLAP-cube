var test = require('tape')
var Table = require('olap-cube').model.Table

test('model Table', (t) => {
  var emptyTable = new Table()

  t.deepEqual(emptyTable.dimensions, [], 'dimensions defaults to []')
  t.deepEqual(emptyTable.points, [[]], 'points defaults to [[]]')
  t.deepEqual(emptyTable.fields, [], 'fields defaults to []')
  t.deepEqual(emptyTable.data, [[[]]], 'data defaults to [[[]]]')

  t.end()
})
