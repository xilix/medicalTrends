var Trends = (function () {
  return {
    onTrendDestroy: function () {},
    destroyTrend: function (trend) {
      State.trends[trend] = undefined;
      delete State.trends[trend];
      Trends.onTrendDestroy();
    },
    meldWithTrends: function (trend, data) {
      var trendDates;

      if (trend) {
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
    },
    writeTrendListInElement: function (id) {
      var element = document.getElementById(id);

      if (Object.keys(State.trends).length) {
        element.innerHTML = [
          '<ul class="trends-list">',
            Object.keys(State.trends).map(function (trend) {
              return [
                '<li>',
                  '<a class="trend-item" href="#" rel="', trend, '">', trend, '</a>',
                  '<a class="trend-destroy" href="#" onclick="Trends.destroyTrend(\'', trend, '\');Trends.writeTrendListInElement(\'', id, '\');">x</a>',
                '</li>'
              ].join('');
            }).join(''),
          '</ul>'
        ].join('');
      } else {
        element.innerHTML = '';
      }
    }
  };
}());
