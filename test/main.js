'use strict';

describe('Main', function () {
  describe('State objects', function () {
    describe('Filter contains user selected filters', function () {
      it('have to be defined', function () {
        expect(State.filter !== undefined).toBe(true);
      });
      it('textSearch filter should be empty at the beginning', function () {
        expect(State.filter.term).toBe('');
      });
      it('begin and end should be the time bounds', function () {
        expect(State.filter.begin <= State.filter.end).toBe(true);
      });
    });
    describe('Trends contains the output trends data', function () {
      it('should be defined at the beginning', function () {
        expect(State.trends !== undefined).toBe(true);
      });
      it('should have empty items at the beginning', function () {
        expect(Object.keys(State.trends).length).toBe(0);
      });
    });
  });
});
