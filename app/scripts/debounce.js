Debounce = function (cb, timing) {
  'use strict';

  var debounceTrend;
  return function () {
    if (debounceTrend) {
      clearTimeout(debounceTrend)
    }
    debounceTrend = setTimeout(cb, timing || 1000);
  }
};
