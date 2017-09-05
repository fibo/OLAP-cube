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

test('addRows()', (t) => {
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

test('slice()', (t) => {
  const table = new Table({
    dimensions: ['year', 'month'],
    fields: ['revenue'],
    points: [ [2016, 'Gen'], [2016, 'Feb'], [2016, 'Mar'] ],
    data: [[100], [170], [280]]
  })

  deepFreeze(table)

  const slicedTable = table.slice('month', 'Gen')

  t.deepEqual(slicedTable.structure, {
    dimensions: ['year', 'month'],
    fields: ['revenue']
  })

  t.deepEqual(slicedTable.points,
    [ [2016, 'Gen'] ]
  )

  t.deepEqual(slicedTable.data,
    [[100]]
  )

  t.end()
})

test('dice()', (t) => {
  const table = new Table({
    dimensions: ['year', 'month'],
    fields: ['revenue'],
    points: [
      [2016, 'Gen'],
      [2016, 'Feb'],
      [2016, 'Mar'],
      [2016, 'Apr'],
      [2016, 'May'],
      [2016, 'Jun'],
      [2016, 'Jul'],
      [2016, 'Aug'],
      [2016, 'Sep'],
      [2016, 'Oct'],
      [2016, 'Nov'],
      [2016, 'Dic'],
      [2017, 'Gen'],
      [2017, 'Feb'],
      [2017, 'Mar'],
      [2017, 'Apr'],
      [2017, 'May'],
      [2017, 'Jun'],
      [2017, 'Jul'],
      [2017, 'Aug'],
      [2017, 'Sep'],
      [2017, 'Oct'],
      [2017, 'Nov'],
      [2017, 'Dic']
    ],
    data: [
      [100], [170], [280], [250], [270], [258],
      [112], [180], [263], [229], [270], [167],
      [120], [285], [293], [257], [271], [226],
      [110], [160], [180], [220], [210], [218]
    ]
  })

  deepFreeze(table)

  const firstQuarter2017 = (point) => {
    const year = point[0]
    const month = point[1]

    return (year === 2017) && (['Gen', 'Feb', 'Mar'].indexOf(month) > -1)
  }

  const dicedTable = table.dice(firstQuarter2017)

  t.deepEqual(dicedTable.structure, {
    dimensions: ['year', 'month'],
    fields: ['revenue']
  })

  t.deepEqual(dicedTable.points, [
    [2017, 'Gen'],
    [2017, 'Feb'],
    [2017, 'Mar']
  ])

  t.deepEqual(dicedTable.data, [
    [120], [285], [293]
  ])

  t.end()
})
