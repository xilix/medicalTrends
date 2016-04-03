var Trends = (function () {
  return {
    meldWithTrends: function (trend, data) {
      var trendDates;

      if (State.trends[trend] === undefined) {
        State.trends[trend] = data;
      } else {
        // do not microoptimize when is not really need
        // and there is a certain drawback in maintanability
        trendDates = State.trends[trend].map(function (tr) {
          return tr.year;
        });
        data.forEach(function (item) {
          if (trendDates.indexOf(item.year) === -1) {
            State.trends[trend].push(item);
          }
        });
        State.trends[trend].sort(function (item1, item2) {
          return item1.year - item2.year;
        });
      }
    }
  };
}());
