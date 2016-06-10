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

### Features

* Everything is immutable
* Chainable interface

## Installation

With [npm] do

```bash
npm install olap-cube
```

## API

All code in this section is run and tested in [this single file][test_api].

### `new Table({ dimensions, fields, points, data })`

Create an empty table

```javascripts
var Table = require('olap-cube').model.Table

var emptyTable = new Table({
  dimensions: ['year', 'month'],
  fields: ['revenue']
})

console.log(table) // Table {
                   //   dimensions: ['year', 'month'],
                   //   fields: ['revenue']
                   // }
```

### `table.structure`

Holds necessary information to clone a table excluding its data.

```javascripts
var table = new Table(emptyTable.structure)

console.log(emptyTable) // Table {
                        //   dimensions: ['year', 'month'],
                        //   fields: ['revenue']
                        // }
```

### `table.addRows([row1, row2, ...])`

```javascripts
var table2 = emptyTable.addRows([
  { year: 2016, month: 'Gen', revenue: 100 },
  { year: 2016, month: 'Feb', revenue: 170 },
  { year: 2016, month: 'Mar', revenue: 280 }
])
```

## License

[MIT](http://g14n.info/mit-license)

[OLAP_cube]: https://en.wikipedia.org/wiki/OLAP_cube "OLAP cube"
[npm]: https://npmjs.com "npm"
[test_api]: https://github.com/fibo/OLAP-cube/blob/master/test/readme/api.js "test API"
