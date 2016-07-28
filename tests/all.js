const chai = require('chai');
chai.use(require('chai-fuzzy'));
const expect = chai.expect;

const parser = require("../lib/parse-dates").parseDates;

describe('@datagica/parse-dates', () => {

  it('should extract dates synchronously', () => {
    [

      { // believable french birth date
        input: "date de naissance: 1 avril 1985",
        output: {
          str: 'Mon Apr 01 1985 00:00:00 GMT+0200 (CEST)',
          timestamp: 481154400000,
          month: 4,
          date: 1,
          year: 1985
        }
      }, { // french birth date - but too old
        input: "date de naissance: 1 avril 1838",
        output: {
          str: 'Sun Apr 01 1838 00:00:00 GMT+0200 (CEST)',
          timestamp: -4157748000000,
          month: 4,
          date: 1,
          year: 1838
        }
      }, { // french birth date - but too young
        input: "date de naissance: 1 avril 2005",
        output: {
          str: 'Fri Apr 01 2005 00:00:00 GMT+0200 (CEST)',
          timestamp: 1112306400000,
          month: 4,
          date: 1,
          year: 2005
        }
      },

      {
        input: "date: March 17, 1973",
        output: {
          str: 'Sat Mar 17 1973 00:00:00 GMT+0100 (CET)',
          timestamp: 101170800000,
          month: 3,
          date: 17,
          year: 1973
        }
      }
    ].map(test => {
      const output = parser.parseDatesSync(test.input, {
        min: 21,
        max: 75
      })
      console.log(JSON.stringify(output));
      expect(output).to.be.like(test.output);
    })
  })

  it('should extract dates asynchronously', (done) => {
    Promise.all(
      [

        { // believable french birth date
          input: "date de naissance: 1 avril 1985",
          output: {
            str: 'Mon Apr 01 1985 00:00:00 GMT+0200 (CEST)',
            timestamp: 481154400000,
            month: 4,
            date: 1,
            year: 1985
          }
        }, { // french birth date - but too old
          input: "date de naissance: 1 avril 1838",
          output: {
            str: 'Sun Apr 01 1838 00:00:00 GMT+0200 (CEST)',
            timestamp: -4157748000000,
            month: 4,
            date: 1,
            year: 1838
          }
        }, { // french birth date - but too young
          input: "date de naissance: 1 avril 2005",
          output: {
            str: 'Fri Apr 01 2005 00:00:00 GMT+0200 (CEST)',
            timestamp: 1112306400000,
            month: 4,
            date: 1,
            year: 2005
          }
        },

        {
          input: "date: March 17, 1973",
          output: {
            str: 'Sat Mar 17 1973 00:00:00 GMT+0100 (CET)',
            timestamp: 101170800000,
            month: 3,
            date: 17,
            year: 1973
          }
        }
      ].map(test => {
        return parser.parseDates(test.input, {
          min: 21,
          max: 75
        }).then(output => {

          console.log(JSON.stringify(output));
          expect(output).to.be.like(test.output)
          return Promise.resolve(true)
        })
      })).then(finished => {
      done()
    }).catch(exc => {
      console.error(exc)
    })
  })


  it('should extract multiple dates (NOTE: NOT SUPPORTED FOR THE MOMENT)', (done) => {
    Promise.all(
      [

        {
          input: `name: john, born: 1 sept 1945
          "name: tom, born: 2 nov 1948`,

          // TODO this should return an array, not a single item
          output: {
            str: 'Sat Sep 01 1945 00:00:00 GMT+0200 (CEST)',
             timestamp: -767930400000,
             month: 9,
             date: 1,
             year: 1945
           }
        }
      ].map(test => {
        return parser.parseDates(test.input, {
          min: 21,
          max: 75
        }).then(output => {

          console.log(JSON.stringify(output));
          expect(output).to.be.like(test.output)
          return Promise.resolve(true)
        })
      })).then(finished => {
      done()
    }).catch(exc => {
      console.error(exc)
    })
  })
})
