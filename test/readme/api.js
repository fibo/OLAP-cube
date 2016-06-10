var test = require('tape')

test('README API', (t) => {
  var Table = require('olap-cube').model.Table
  var emptyTable = new Table()

  emptyTable

  t.end()
})

