'use strict';

var State,
    Resource;

State = {
  filter: {
    textSearch: '',
    begin: new Date().getFullYear(),
    end: new Date().getFullYear(),
    timeSpan: 'm'
  },
  trends: []
};

Resource = (function () {
  var queryBuilder = function (endpoints) {
    var endPoints = endpoints || {},
        filterOptions = {},
        Builder = {};

    function escapeUrlParams(params) {
      if (params) {
        return encodeURI(
          params.replace(/ /g, '+')
        );
      }
    }
    function queryParamPair(key, value) {
      if (value) {
        return key + '=' + value;
      }
    }

    Builder = {
      setEndPoints: function (urls) {
        // shallow copy
        endPoints.search = urls.search;
        endPoints.db = utls.db;

        return Builder;
      },
      setFilter: function (filter) {
        // shallow copy
        filterOptions.term = filter.term;
        filterOptions.begin = filter.begin;
        filterOptions.end = filter.end;

        return Builder;
      },
      getDbQuery: function () {
        return endPoints.db;
      },
      getSearchQuery: function (filter) {
        if (filter) {
          Builder.setFilter(filter);
        }

        return endPoints.search + '?' + [
          queryParamPair('db', 'pubmed'),
          queryParamPair('term', escapeUrlParams(filterOptions.term)),
          queryParamPair('mindate', escapeUrlParams(
            !filterOptions.begin ? filterOptions.begin : filterOptions.begin + '/01/01'
          )),
          queryParamPair('maxdate', escapeUrlParams(
            !filterOptions.end ? filterOptions.end : filterOptions.end + '/12/31'
          )),
          queryParamPair('retmode', 'json')
        ]
        .filter(function (item) {
          // we don't show the parameters that are empty
          return item !== undefined;
        })
        .join('&');
      }
    };

    return Builder;
  };

  return {
    queryBuilder: queryBuilder
  };
}());
