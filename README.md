
Date parser

Can extract a date from a document. well, most of the time.

```javascript
{
  // get the birth date and estimate the age
parseDates( "date: March 17, 1973")
output: {
  str: 'Sat Mar 17 1973 00:00:00 GMT+0100 (CET)',
  timestamp: 101170800000,
  month: 3,
  date: 17,
  year: 1973
}
}
```

## TODO

- should match MULTIPLES dates (as for the moment only one is returned)
- date parser should support more text formats
- should support more languages, too
