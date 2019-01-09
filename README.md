# OLAP-cube

> is an hypercube of data

[Description](#description) |
[Installation](#installation) |
[API](#api) |
[License](#license)

[![NPM version](https://badge.fury.io/js/olap-cube.svg)](http://badge.fury.io/js/olap-cube)
[![Build Status](https://travis-ci.org/fibo/OLAP-cube.svg?branch=master)](https://travis-ci.org/fibo/OLAP-cube?branch=master)
[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Description

An [OLAP cube][OLAP_cube] is a multidimensional array of data you can
explore and analyze. Here you will find an engine that could feed a graphic viewer.

## Installation

### Using npm

With [npm] do

```bash
npm install olap-cube
```

### Using a CDN

Add this to your HTML page

```html
<script src="https://unpkg.com/sql92-json/dist/olap-cube.min.js"></script>
```

## API

All code in this section is run and tested in [this single file][test_api].
Note also that

1. Everything is immutable, all attributes are static.
2. Operators are chainable and they always return a brand new instance.

### `new Table({ dimensions, fields, points, data })`

* **@param** `{Object}` *arg*
* **@param** `{Array}` *arg.dimensions*
* **@param** `{Array}` *arg.points*
* **@param** `{Array}` *arg.fields*
* **@param** `{Array}` *arg.data* in the format data[pointIndex][fieldIndex]

```javascript
const Table = require('olap-cube').model.Table

const table = new Table({
  dimensions: ['year', 'month'],
  fields: ['revenue'],
  points: [[2016, 'Jan']],
  data: [[100]]
})

console.log(table) // Table {
                   //   dimensions: ['year', 'month'],
                   //   fields: ['revenue']
                   // }
```

### `table.structure`

> Attribute *structure* holds necessary information to clone a table excluding its data.

Create an empty table

```javascript
const emptyTable = new Table(table.structure)
```

### `table.dimensions`

> The (hyper)cube dimensions.

One common dimension in [Business Intelligence][Business_intelligence]
is **time**: it can have different granularities, like *year*, *month*, *day*, etc.

```javascript
console.log(table.dimensions) // [ 'year', 'month' ]
```

### `table.fields`

> The names of the data *fields*.

```javascript
console.log(table.fields) // [ 'revenue' ]
```

### `table.header`

> Attribute *header* concatenates dimension names and field names.

```javascript
console.log(table.header) // ['year', 'month', 'revenue']
```

### `table.addRows({ header: [key1, key2, ...], rows: [row1, row2, ...]})`

> Add a set of rows to the table.

* **@param** `{Object}` *data*
* **@param** `{Array}` *data.header*
* **@param** `{Array}` *data.rows*
* **@returns** `{Object}` *table*

Every row is an object which attributes are either a dimension or a field.

```javascript
const table2 = emptyTable.addRows({
  header: ['year', 'month', 'revenue'],
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
```

### `table.data`

> Attribute *data* holds the facts of the table.

```javascript
console.log(table2.data) // [[ 80 ],
                         //  [ 90 ],
                         //  [ 100 ],
                         //  [ 170 ],
                         //  [ 280 ],
                         //  [ 177 ],
                         //  [ 410 ]]
```

### `table.rows`

> Attribute *rows* holds the dimensions and the facts of the table.

```javascript
console.log(table2.rows) // [[ 2015, 'Nov', 80 ],
                         //  [ 2015, 'Dec', 90 ],
                         //  [ 2016, 'Jan', 100 ],
                         //  [ 2016, 'Feb', 170 ],
                         //  [ 2016, 'Mar', 280 ],
                         //  [ 2017, 'Feb', 177 ],
                         //  [ 2017, 'Apr', 410 ]]
```

### `table.points`

> The *points* are an ordered set of coordinates.

In this case you can see 6 points with coordinates:

1. year
2. month

```javascript
console.log(table2.points) // [[ 2015, 'Nov' ],
                           //  [ 2015, 'Dec' ],
                           //  [ 2016, 'Jan' ],
                           //  [ 2016, 'Feb' ],
                           //  [ 2016, 'Feb' ],
                           //  [ 2017, 'Apr' ]]
```

### `table.slice(dimension, filter)`

> Slice operator picks a rectangular subset of a cube by choosing a single value of its dimensions.

* **@param** `{String}` *dimension*
* **@param** `{*}` *filter*
* **@returns** `{Object}` *table*

Consider the following example, where a slice with 2016 year is created.

```javascript
const table3 = table2.slice('year', 2016)

console.log(table3.points) // [[ 2016, 'Jan' ],
                           //  [ 2016, 'Feb' ],
                           //  [ 2016, 'Mar' ]]

console.log(table3.data) // [[ 100 ],
                         //  [ 170 ],
                         //  [ 280 ]]
```

### `table.dice(selector)`

> Dice operator picks a subcube by choosing a specific values of multiple dimensions.

* **@param** `{Function}` *selector*
* **@returns** `{Object}` *table*

Consider the following example, where a dice excluding one month is created.

```javascript
const onlyFebruary = (point) => point[1] !== 'Feb'

const table4 = table2.dice(onlyFebruary)

console.log(table4.points) // [[ 2015, 'Nov' ],
                           //  [ 2015, 'Dec' ],
                           //  [ 2016, 'Jan' ],
                           //  [ 2016, 'Mar' ],
                           //  [ 2017, 'Apr' ]]

console.log(table4.data) // [[ 80 ],
                         //  [ 90 ],
                         //  [ 100 ],
                         //  [ 280 ],
                         //  [ 410 ]]
```

### `table.rollup(dimension, fields, aggregator, initialValue)`

> A roll-up involves summarizing the data along a dimension. The summarization rule might be computing totals along a hierarchy or applying a set of formulas such as "profit = sales - expenses".

* **@param** `{String}` *dimension*
* **@param** `{Array}` *fields*
* **@param** `{Function}` *aggregator*
* **@param** `{*}` *initialValue* that will be passed to Array.prototype.reduce().
* **@returns** `{Object}` *table*

```javascript
const table5 = new Table({
  dimensions: ['continent', 'country'],
  fields: ['numStores']
})

// NOTA BENE: Remember that tables are immuTables ☺.
const table6 = table5.addRows({
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

// Input tables and rolled up table has only one field,
// with the same name: numStores.
// Actually the aggregator is a reducer that will receive in input an
// array of fields from the input table, and will output an array of
// fields to the rolled up table.
const summation = (sum, value) => {
  return [sum[0] + value[0]]
}

const initialValue = [0]

const table7 = table6.rollup('continent', ['numStores'], summation, initialValue)

console.log(table7.rows) // [[ 'Europe', 195 ],
                         //  [ 'Asia', 561 ]]
```

## License

[MIT](http://g14n.info/mit-license)

[OLAP_cube]: https://en.wikipedia.org/wiki/OLAP_cube "OLAP cube"
[npm]: https://npmjs.com "npm"
[test_api]: https://github.com/fibo/OLAP-cube/blob/master/test/readme/api.js "test API"
[Business_intelligence]: https://en.wikipedia.org/wiki/Business_intelligence "Business Intellicence"
