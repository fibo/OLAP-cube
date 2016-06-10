# OLAP-cube

> is an hypercube of data

[Description](#description) |
[Installation](#installation) |
[API] |
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

### `new Table({ dimensions, fields, points, data })`

Create an empty table

```javascripts
var Table = require('olap-cube').model.Table

var emptyTable = new Table()

emptyTable // Table { dimensions: [], fields: [] }
```

## License

[MIT](http://g14n.info/mit-license)

[OLAP_cube]: https://en.wikipedia.org/wiki/OLAP_cube "OLAP cube"
[npm]: https://npmjs.com "npm"
