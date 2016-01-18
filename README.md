
Date parser

Can extract a date from a document. well, most of the time.

## Installation

    $ npm install --save @datagica/parse-dates

## Usage

```javascript
import parseDates from "@datagica/parse-dates";

parseDates(INPUT).then(result => {
  if (result == null) {
    console.log("not found")
  } else {
    console.log("found: ", result)
  }
}).catch(err => {
  console.log("invalid input data: "+err)
})
```

## Examples

```javascript
{
import parseDates from "@datagica/parse-dates";

parseDates("date: March 17, 1973").then(..).catch(..)
// will output:
{
  str: 'Sat Mar 17 1973 00:00:00 GMT+0100 (CET)',
  timestamp: 101170800000,
  month: 3,
  date: 17,
  year: 1973
}

parseDates("je suis né le 1 avril 1985").then(..).catch(..)
// will output:
{
  str: 'Mon Apr 01 1985 00:00:00 GMT+0200 (CEST)',
  timestamp: 481154400000,
  month: 4,
  date: 1,
  year: 1985
}
```

## TODO

- should match MULTIPLES dates (as for the moment only one is returned)
- date parser should support more text formats
- should support more languages, too
