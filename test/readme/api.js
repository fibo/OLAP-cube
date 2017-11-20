const test = require('tape')

test('README API', (t) => {
  const Table = require('olap-cube').model.Table

  // constructor

  const table = new Table({
    dimensions: ['year', 'month'],
    fields: ['revenue'],
    points: [[2016, 'Jan']],
    data: [[100]]
  })

  t.deepEqual(table.dimensions, ['year', 'month'], 'table.dimensions')
  t.deepEqual(table.fields, ['revenue'], 'table.fields')
  t.deepEqual(table.header, ['year', 'month', 'revenue'], 'table.header')


  const emptyTable = new Table(table.structure)

  // addRows

  const table2 = emptyTable.addRows({
    header: [ 'year', 'month', 'revenue' ],
    rows: [
      [ 2015, 'Nov', 80 ],
      [ 2015, 'Dec', 90 ],
      [ 2016, 'Jan', 100 ],
      [ 2016, 'Feb', 170 ],
      [ 2016, 'Mar', 280 ],
      [ 2017, 'Feb', 177 ],
      [ 2017, 'Apr', 410 ]
    ]
  })

  t.deepEqual(table2.data, [
    [ 80 ],
    [ 90 ],
    [ 100 ],
    [ 170 ],
    [ 280 ],
    [ 177 ],
    [ 410 ]
  ], 'data')

  t.deepEqual(table2.rows, [
    [ 2015, 'Nov', 80 ],
    [ 2015, 'Dec', 90 ],
    [ 2016, 'Jan', 100 ],
    [ 2016, 'Feb', 170 ],
    [ 2016, 'Mar', 280 ],
    [ 2017, 'Feb', 177 ],
    [ 2017, 'Apr', 410 ]
  ], 'rows')

  t.deepEqual(table2.points, [
    [ 2015, 'Nov' ],
    [ 2015, 'Dec' ],
    [ 2016, 'Jan' ],
    [ 2016, 'Feb' ],
    [ 2016, 'Mar' ],
    [ 2017, 'Feb' ],
    [ 2017, 'Apr' ]
  ], 'points')

  // Slice.

  const table3 = table2.slice('year', 2016)

  t.deepEqual(table3.points, [
    [ 2016, 'Jan' ],
    [ 2016, 'Feb' ],
    [ 2016, 'Mar' ]
  ], 'sliced points')

  t.deepEqual(table3.data, [
    [ 100 ],
    [ 170 ],
    [ 280 ]
  ], 'sliced data')

  const notFebruary = (point) => point[1] !== 'Feb'

  // Dice.

  const table4 = table2.dice(notFebruary)

  t.deepEqual(table4.points, [
    [ 2015, 'Nov' ],
    [ 2015, 'Dec' ],
    [ 2016, 'Jan' ],
    [ 2016, 'Mar' ],
    [ 2017, 'Apr' ]
  ], 'diced points')

  t.deepEqual(table4.data, [
    [ 80 ],
    [ 90 ],
    [ 100 ],
    [ 280 ],
    [ 410 ]
  ], 'diced data')

  // Roll up.

  const summation = (a, b) => a + b

  const table5 = new Table({
    dimensions: ['continent', 'country'],
    fields: ['numStores']
  })

  table5.addRows({
    header: [ 'continent', 'country', 'numStores' ],
    rows: [
      [ 'Europe', 'Norway', 20 ],
      [ 'Europe', 'Denmark', 48 ],
      [ 'Europe', 'Germany', 110 ],
      [ 'Europe', 'Portugal', 17 ],
      [ 'Asia', 'China', 280 ],
      [ 'Asia', 'Russia', 161 ],
      [ 'Asia', 'Thailand', 120 ]
    ]
  })

  const table6 = table5.rollup('continent', summation)
/*
  t.deepEqual(table6.rows, [
    [ 'Europe', 195 ],
    [ 'Asia', 561 ]
  ], 'rolled up points')
  */

  t.end()
})
