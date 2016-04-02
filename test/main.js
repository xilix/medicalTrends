'use strict';

describe('Main', function () {
  describe('State objects', function () {
    describe('Filter contains user selected filters', function () {
      it('have to be defined', function () {
        expect(State.filter !== undefined).toBe(true);
      });
      it('textSearch filter should be empty at the beginning', function () {
        expect(State.filter.textSearch).toBe('');
      });
      it('begin and end should be the time bounds', function () {
        expect(State.filter.begin <= State.filter.end).toBe(true);
      });
      it('time stamp should be a time unit', function () {
        expect(
          ['y', 'm', 'd'].indexOf(State.filter.timeSpan) !== -1
        ).toBe(true);
      });
    });
    describe('Trends contains the output trends data', function () {
      it('should be defined at the beginning', function () {
        expect(State.trends !== undefined).toBe(true);
      });
      it('should have empty items at the beginning', function () {
        expect(State.trends.length).toBe(0);
      });
    });
  });
  describe('Resource', function () {
    describe('queryBuilder', function () {
      var queryBuilder;
      beforeEach(function () {
        queryBuilder = Resource.queryBuilder({
          db: 'http://aaa',
          search: 'http://bbb'
        });
      });
      it('generate a query to lis db in NBCI', function () {
        expect(queryBuilder.getDbQuery()).toBe('http://aaa');
      })
      it('generate a query to search UID in NBCI', function () {
        expect(
          queryBuilder.getSearchQuery({
            term: 'ccc',
            begin: 2015,
            end: 2016
          })
        ).toEqual('http://bbb?db=pubmed&term=ccc&mindate=2015/01/01&maxdate=2016/12/31&retmode=json');
        expect(
          queryBuilder.getSearchQuery({
            term: 'ccc',
            end: 2016
          })
        ).toEqual('http://bbb?db=pubmed&term=ccc&maxdate=2016/12/31&retmode=json');
        expect(
          queryBuilder.getSearchQuery({
            term: 'cc cc',
            end: 2016
          })
        ).toEqual('http://bbb?db=pubmed&term=cc+cc&maxdate=2016/12/31&retmode=json');


      })
    });
  });
});
