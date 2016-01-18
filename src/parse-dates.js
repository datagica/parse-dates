import XRegExp from "xregexp";

class ParseDates {
  constructor(opts = {}) {

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

    this.monthsArray = [
      'jan',
      'feb',
      'mar',
      'apr',
      'may',
      'jun',
      'jul',
      'aug',
      'sep',
      'oct',
      'nov',
      'dec'
    ];

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

    this.yearPattern = `(?:1|2)\\d\\d\\d`;
    this.dateNumSeparator = `(?:\\.|\\/|\\-)`;

    this.dateStrPatterns = [];
    for (let i = 1; i < 10; i++) {
      if (typeof this[`datePattern${i}`] === "function") {
        this.dateStrPatterns.push(
          `${this['datePattern'+i]()}`
        )
      }
    }
    this.datePatterns = new XRegExp(this.dateStrPatterns.join('|'), 'i')
  }
  monthPattern(i = 1, side = "") {
    return this.monthsArray
      .map(key => `(?<${key}${i}${side}>${this.months[key]})`)
      .join(`|`)
  }
  datePattern1(side = "") {
    const n = 1;
    return `(?<month${n}${side}>${this.monthPattern(n, side)})\\s?` +
      `(?<date${n}${side}>\\d\\d?)\\s?(?:th)?,?\\s?` +
      `(?<year${n}${side}>${this.yearPattern})`
  }
  datePattern2(side = "") {
    const n = 2;
    return `(?<date${n}${side}>\\d\\d?)\\s?(?:th)?,?\\s?` +
      `(?<month${n}${side}>${this.monthPattern(n, side)})\\s?` +
      `(?<year${n}${side}>${this.yearPattern})`
  }
  datePattern3(side = "") {
    const n = 3;
    return `(?<date${n}${side}>10|11|12|0\\d|\\d)` + `
    ${this.dateNumSeparator}(?<month${n}${side}>10|11|12|0\\d|\\d)${this.dateNumSeparator}` +
      `(?<year${n}${side}>${this.yearPattern})`
  }
  matchToMonths(match, n = null, s = "") {
    for (let i = 0; i < this.monthsArray.length; i++) {
      const month = this.monthsArray[i];
      if (n !== null && s !== "" && match[`${month}${n}${s}`]) {
        return this.monthsToNum[month];
      }
      if (n !== null && match[`${month}${n}`]) {
        return this.monthsToNum[month];
      } else if (match[`${month}1`] || match[`${month}2`] || match[`${month}3`]) {
        return this.monthsToNum[month];
      }
    }
    return 1;
  }

  matchToYears(match, n = null, s = "") {
    return parseInt(
      (n !== null) ? match[`year${n}${s}`] : match.year1 ? match.year1 : match.year2 ? match.year2 : match.year3 ? match.year3 : 0
    )
  }

  matchToDays(match, n = null, s = "") {
    return parseInt(
      (n !== null) ? match[`date${n}${s}`] : match.date1 ? match.date1 : match.date2 ? match.date2 : match.date3 ? match.date3 : 0
    )
  }
  matchToDate(match, n = null, side = "") {
    const date = new Date(
      this.matchToYears(match, n),
      this.matchToMonths(match, n) - 1,
      this.matchToDays(match, n)
    );
    return {
      str: date.toString(),
      timestamp: +date,
      month: date.getMonth() + 1,
      date: date.getDate(),
      year: date.getFullYear()
    };
  }

  parseDates(input, opts = {}) {

    let text = ""
    if (typeof input === 'string') {
      text = input
    } else if (typeof input.text === 'string') {
      text = input.text
    } else {
      return Promise.reject(new Error(`input is not text but ${typeof input}`))
    }

    const match = XRegExp.exec(text, this.datePatterns);
    try {
      return Promise.resolve(this.matchToDate(match));
    } catch (err) {
      return Promise.resolve(null);
    }
  }
}

const singletonInstance = new ParseDates()
const singletonMethod = function(...opts) {
  return singletonInstance.parseDates(...opts)
}

module.exports = singletonMethod
module.exports.default = singletonMethod
module.exports.parseDates = singletonInstance
module.exports.ParseDates = ParseDates
