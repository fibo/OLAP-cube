const test = require('tape')

test('README API', (t) => {
  const Table = require('olap-cube').model.Table

  const table = new Table({
    dimensions: ['year', 'month'],
    fields: ['revenue'],
    points: [[2016, 'Gen']],
    data: [[100]]
  })

  t.deepEqual(table.dimensions, ['year', 'month'], 'table.dimensions')
  t.deepEqual(table.fields, ['revenue'], 'table.fields')

  const emptyTable = new Table(table.structure)

  const table2 = emptyTable.addRows({
    header: [ 'year', 'month', 'revenue' ],
    rows: [
      [ 2015, 'Nov', 80 ],
      [ 2015, 'Dec', 90 ],
      [ 2016, 'Jan', 100 ],
      [ 2016, 'Feb', 170 ],
      [ 2016, 'Mar', 280 ],
      [ 2017, 'Apr', 410 ]
    ]
  })

  t.deepEqual(table2.data, [[ 80 ],
                            [ 90 ],
                            [ 100 ],
                            [ 170 ],
                            [ 280 ],
                            [ 410 ]], 'data')

  t.deepEqual(table2.points, [[ 2015, 'Nov' ],
                              [ 2015, 'Dec' ],
                              [ 2016, 'Jan' ],
                              [ 2016, 'Feb' ],
                              [ 2016, 'Mar' ],
                              [ 2017, 'Apr' ]], 'points')

  const table3 = table2.slice('year', 2016)

  t.deepEqual(table3.points, [[ 2016, 'Jan' ],
                              [ 2016, 'Feb' ],
                              [ 2016, 'Mar' ]], 'sliced points')

  t.deepEqual(table3.data, [[ 100 ],
                            [ 170 ],
                            [ 280 ]], 'sliced data')

  t.end()
})

