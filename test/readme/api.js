var test = require('tape')

test('README API', (t) => {
  var Table = require('olap-cube').model.Table

  var table = new Table({
    dimensions: ['year', 'month'],
    fields: ['revenue'],
    points: [2016, 'Gen'],
    data: [[[100]]]
  })

  console.log(table)

  var emptyTable = new Table(table.structure)

  console.log(emptyTable)

  var table2 = emptyTable.addRows([
    { year: 2016, month: 'Gen', revenue: 100 },
    { year: 2016, month: 'Feb', revenue: 170 },
    { year: 2016, month: 'Mar', revenue: 280 }
  ])

  t.end()
})

