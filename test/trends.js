describe('Trends', function () {
  describe('meldWithTrend', function () {
    beforeEach(function () {
      State.trends = {
        a: [
          {year: 10},
          {year: 11},
          {year: 12},
          {year: 13}
        ]
      }
    });
    it('merge nex dates', function () {
      Trends.meldWithTrends('a', [
        {year: 9},
        {year: 10, count: 3},
        {year: 13, count: 5},
        {year: 14}
      ]);
      expect(State.trends.a).toEqual([
        {year: 9},
        {year: 10},
        {year: 11},
        {year: 12},
        {year: 13},
        {year: 14}
      ]);
    });
    it('if trend is no present is created', function () {
      Trends.meldWithTrends('b', [
        {year: 9},
        {year: 10, count: 3},
        {year: 13, count: 5},
        {year: 14}
      ]);
      expect(State.trends.b).toEqual([
        {year: 9},
        {year: 10, count: 3},
        {year: 13, count: 5},
        {year: 14}
      ]);
    });
    afterEach(function () {
      State.trends = {};
    });
  });
});
