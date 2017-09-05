const test = require('tape')
const deepFreeze = require('deep-freeze')
const Table = require('olap-cube').model.Table

test('Table constructor', (t) => {
  const nullTable = new Table()

  t.deepEqual(nullTable.dimensions, [], 'dimensions defaults to []')
  t.deepEqual(nullTable.points, [], 'points defaults to []')
  t.deepEqual(nullTable.fields, [], 'fields defaults to []')
  t.deepEqual(nullTable.data, [], 'data defaults to []')

  const table = new Table({
    dimensions: ['year', 'month'],
    fields: ['revenue'],
    points: [ [2016, 'Gen'], [2016, 'Feb'], [2016, 'Mar'] ],
    data: [[100], [170], [280]]
  })

  deepFreeze(table)

  t.deepEqual(table.structure, {
    dimensions: ['year', 'month'],
    fields: ['revenue']
  })

  t.end()
})

test('addRows', (t) => {
  const emptyTable = new Table({
    dimensions: ['year', 'month'],
    fields: ['revenue']
  })

  const table = emptyTable.addRows({
    header: ['year', 'month', 'revenue'],
    rows: [
      [ 2016, 'Gen', 100 ],
      [ 2016, 'Feb', 170 ],
      [ 2016, 'Mar', 280 ]
    ]
  })

  deepFreeze(emptyTable)

  t.deepEqual(table.structure, {
    dimensions: ['year', 'month'],
    fields: ['revenue']
  })

  t.deepEqual(table.points,
    [ [2016, 'Gen'], [2016, 'Feb'], [2016, 'Mar'] ]
  )

  t.deepEqual(table.data,
    [[100], [170], [280]]
  )

  t.end()
})
