# OLAP-cube

> is an hypercube of data

[![NPM version](https://badge.fury.io/js/OLAP-cube.svg)](http://badge.fury.io/js/OLAP-cube) [![Build Status](https://travis-ci.org/fibo/OLAP-cube.svg?branch=master)](https://travis-ci.org/fibo/OLAP-cube?branch=master) [![Dependency Status](https://david-dm.org/fibo/OLAP-cube.svg)](https://david-dm.org/fibo/OLAP-cube)

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)

[Description](#description) |
[Installation](#installation) |
[API](#api) |
[License](#license)

## Description

An [OLAP cube][OLAP_cube] is a multidimensional array of data you can
explore and analyze. Here you will find an engine and a graphic viewer.

## Installation

With [npm] do

```bash
npm install olap-cube
```

## API

All code in this section is run and tested in [this single file][test_api].
Note also that

1. Everything is immutable
2. Interface is chainable

### `new Table({ dimensions, fields, points, data })`

```javascripts
var Table = require('olap-cube').model.Table

var table = new Table({
  dimensions: ['year', 'month'],
  fields: ['revenue'],
  points: [[2016, 'Gen']],
  data: [[100]]
})

console.log(table) // Table {
                   //   dimensions: ['year', 'month'],
                   //   fields: ['revenue']
                   // }
```

### `table.structure`

Holds necessary information to clone a table excluding its data.

Create an empty table

```javascripts
var emptyTable = new Table(table.structure)
```

### `table.dimensions`

```javascripts
console.log(table.dimensions) // [ 'year', 'month' ]
```

### `table.fields`

```javascripts
console.log(table.fields) // [ 'revenue' ]
```

### `table.addRows([row1, row2, ...])`

Every row is an object which attributes are either a dimension or a field.

```javascripts
var table2 = emptyTable.addRows([
  { year: 2015, month: 'Nov', revenue: 80 },
  { year: 2015, month: 'Dec', revenue: 90 },
  { year: 2016, month: 'Jan', revenue: 100 },
  { year: 2016, month: 'Feb', revenue: 170 },
  { year: 2016, month: 'Mar', revenue: 280 }
])
```

### `table.data`

```javascripts
console.log(table2.data) // [[ 80 ],
                         //  [ 90 ],
                         //  [ 100 ],
                         //  [ 170 ],
                         //  [ 280 ]]
```

### `table.points`

```javascripts
console.log(table2.points) // [[ 2015, 'Nov' ],
                           //  [ 2015, 'Dec' ],
                           //  [ 2016, 'Jan' ],
                           //  [ 2016, 'Feb' ],
                           //  [ 2016, 'Mar' ]]
```

### `table.slice(dimension, table)`

```javascripts
var table3 = table2.slice('year', 2016)

console.log(table3.points) // [[ 2016, 'Jan' ],
                           //  [ 2016, 'Feb' ],
                           //  [ 2016, 'Mar' ]]

console.log(table3.data) // [[ 100 ],
                         //  [ 170 ],
                         //  [ 280 ]]
```

## License

[MIT](http://g14n.info/mit-license)

[OLAP_cube]: https://en.wikipedia.org/wiki/OLAP_cube "OLAP cube"
[npm]: https://npmjs.com "npm"
[test_api]: https://github.com/fibo/OLAP-cube/blob/master/test/readme/api.js "test API"
