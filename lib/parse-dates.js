'use strict';

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _xregexp = require('xregexp');

var _xregexp2 = _interopRequireDefault(_xregexp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ParseDates = function () {
  function ParseDates() {
    var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    (0, _classCallCheck3.default)(this, ParseDates);

    this.months = {
      jan: '0?1|jan|jan\\.|janv|janv\\.|january|janvier',
      feb: '0?2|février|fevrier|fevr|fev|feb|february|fev\\.|feb\\.',
      mar: '0?3|march|mars|marz|mar|mar\\.',
      apr: '0?4|april|avril|abril|apr|avr|abr|apr\\.|avr\\.|abr\\.',
      may: '0?5|may|mai',
      jun: '0?6|june|juin|jun|jun\\.',
      jul: '0?7|july|juillet|jul|jui|jul\\.|jui\\.',
      aug: '0?8|august|août|aout|aug|aug\\.',
      sep: '0?9|septembre|september|sept|sep|sept\\.|sep\\.',
      oct: '1?0|octobre|october|oct|oct\\.',
      nov: '11|novembre|november|nov|nov\\.',
      dec: '12|décembre|decembre|december|dec|déc|dec\\.|déc\\.'

    };

    this.monthsArray = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

    this.monthsToNum = {
      jan: 1,
      feb: 2,
      mar: 3,
      apr: 4,
      may: 5,
      jun: 6,
      jul: 7,
      aug: 8,
      sep: 9,
      oct: 10,
      nov: 11,
      dec: 12
    };

    this.yearPattern = '(?:1|2)\\d\\d\\d';
    this.dateNumSeparator = '(?:\\.|\\/|\\-)';

    this.dateStrPatterns = [];
    for (var i = 1; i < 10; i++) {
      if (typeof this['datePattern' + i] === "function") {
        this.dateStrPatterns.push('' + this['datePattern' + i]());
      }
    }
    this.datePatterns = new _xregexp2.default(this.dateStrPatterns.join('|'), 'i');
  }

  (0, _createClass3.default)(ParseDates, [{
    key: 'monthPattern',
    value: function monthPattern() {
      var _this = this;

      var i = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
      var side = arguments.length <= 1 || arguments[1] === undefined ? "" : arguments[1];

      return this.monthsArray.map(function (key) {
        return '(?<' + key + i + side + '>' + _this.months[key] + ')';
      }).join('|');
    }
  }, {
    key: 'datePattern1',
    value: function datePattern1() {
      var side = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];

      var n = 1;
      return '(?<month' + n + side + '>' + this.monthPattern(n, side) + ')\\s?' + ('(?<date' + n + side + '>\\d\\d?)\\s?(?:th)?,?\\s?') + ('(?<year' + n + side + '>' + this.yearPattern + ')');
    }
  }, {
    key: 'datePattern2',
    value: function datePattern2() {
      var side = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];

      var n = 2;
      return '(?<date' + n + side + '>\\d\\d?)\\s?(?:th)?,?\\s?' + ('(?<month' + n + side + '>' + this.monthPattern(n, side) + ')\\s?') + ('(?<year' + n + side + '>' + this.yearPattern + ')');
    }
  }, {
    key: 'datePattern3',
    value: function datePattern3() {
      var side = arguments.length <= 0 || arguments[0] === undefined ? "" : arguments[0];

      var n = 3;
      return '(?<date' + n + side + '>10|11|12|0\\d|\\d)' + ('\n    ' + this.dateNumSeparator + '(?<month' + n + side + '>10|11|12|0\\d|\\d)' + this.dateNumSeparator) + ('(?<year' + n + side + '>' + this.yearPattern + ')');
    }
  }, {
    key: 'matchToMonths',
    value: function matchToMonths(match) {
      var n = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
      var s = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];

      for (var i = 0; i < this.monthsArray.length; i++) {
        var month = this.monthsArray[i];
        if (n !== null && s !== "" && match['' + month + n + s]) {
          return this.monthsToNum[month];
        }
        if (n !== null && match['' + month + n]) {
          return this.monthsToNum[month];
        } else if (match[month + '1'] || match[month + '2'] || match[month + '3']) {
          return this.monthsToNum[month];
        }
      }
      return 1;
    }
  }, {
    key: 'matchToYears',
    value: function matchToYears(match) {
      var n = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
      var s = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];

      return parseInt(n !== null ? match['year' + n + s] : match.year1 ? match.year1 : match.year2 ? match.year2 : match.year3 ? match.year3 : 0);
    }
  }, {
    key: 'matchToDays',
    value: function matchToDays(match) {
      var n = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
      var s = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];

      return parseInt(n !== null ? match['date' + n + s] : match.date1 ? match.date1 : match.date2 ? match.date2 : match.date3 ? match.date3 : 0);
    }
  }, {
    key: 'matchToDate',
    value: function matchToDate(match) {
      var n = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];
      var side = arguments.length <= 2 || arguments[2] === undefined ? "" : arguments[2];

      var date = new Date(this.matchToYears(match, n), this.matchToMonths(match, n) - 1, this.matchToDays(match, n));
      return {
        str: date.toString(),
        timestamp: +date,
        month: date.getMonth() + 1,
        date: date.getDate(),
        year: date.getFullYear()
      };
    }
  }, {
    key: 'parseDates',
    value: function parseDates(input) {
      var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

      var text = "";
      if (typeof input === 'string') {
        text = input;
      } else if (typeof input.text === 'string') {
        text = input.text;
      } else {
        return _promise2.default.reject(new Error('input is not text but ' + (typeof input === 'undefined' ? 'undefined' : (0, _typeof3.default)(input))));
      }

      var match = _xregexp2.default.exec(text, this.datePatterns);
      try {
        return _promise2.default.resolve(this.matchToDate(match));
      } catch (err) {
        return _promise2.default.resolve(null);
      }
    }
  }]);
  return ParseDates;
}();

var singletonInstance = new ParseDates();
var singletonMethod = function singletonMethod() {
  return singletonInstance.parseDates.apply(singletonInstance, arguments);
};

module.exports = singletonMethod;
module.exports.default = singletonMethod;
module.exports.parseDates = singletonInstance;
module.exports.ParseDates = ParseDates;