var Resource = (function () {
  'use strict';

  var queryBuilder = function (endpoints) {
    var endPoints = endpoints || {
          db: 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/einfo.fcgi',
          search: 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi',
          fetch: 'http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi'
        },
        filterOptions = {},
        Builder = {},
        history,
        queryParamsDefinitions = [
          {
            name: 'db',
            search: true,
            fetch: true,
            getter: function () {
              return 'pubmed';
            }
          },
          {
            name: 'term',
            search: true,
            getter: function (filterOptions) {
              return escapeUrlParams(filterOptions.term);
            }
          },
          {
            name: 'mindate',
            search: true,
            getter: function (filterOptions) {
              return escapeUrlParams(
                !filterOptions.begin ? filterOptions.begin : filterOptions.begin + '/01/01'
              );
            }
          },
          {
            name: 'maxdate',
            search: true,
            getter: function (filterOptions) {
              return escapeUrlParams(
                !filterOptions.end ? filterOptions.end : filterOptions.end + '/12/31'
              );
            }
          },
          {
            name: 'retmode',
            search: true,
            fetch: true,
            getter: function () {
              return 'json';
            }
          }
        ];

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
      setHistory: function (obj) {
        history = obj;

        return Builder
      },
      getDbQuery: function () {
        return endPoints.db;
      },
      getSearchQuery: function (filter) {
        if (filter) {
          Builder.setFilter(filter);
        }

        return endPoints.search + '?' +
        queryParamsDefinitions
        .filter(function (item) {
          return item.search;
        })
        .concat(
          history ? [{
            name: 'usehistory',
            getter: function () {
              return 'y';
            }
          }] : []
        )
        .map(function (definition) {
          return queryParamPair(
            definition.name, definition.getter(filterOptions)
          );
        })
        .filter(function (item) {
          // we don't show the parameters that are empty
          return item !== undefined;
        })
        .join('&');
      },
      getFetchQuery: function (filter) {
        if (filter) {
          Builder.setFilter(filter);
        }

        return endPoints.fetch + '?' +
        queryParamsDefinitions
        .filter(function (item) {
          return item.fetch;
        })
        .concat(
          history ? [
            {
              name: 'query_key',
              getter: function (filterOptions) {
                return history.key;
              }
            },
            {
              name: 'WebEnv',
              getter: function (filterOptions) {
                return history.env;
              }
            }
          ] : []
        )
        .map(function (definition) {
          return queryParamPair(
            definition.name, definition.getter(filterOptions)
          );
        })
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
    queryBuilder: queryBuilder,
    get: function (uri, cb) {
      d3.json(uri, cb);
    },
    search: function (filter, cb) {
      d3.json(
        this.queryBuilder().setHistory(false).getSearchQuery(filter), cb
      );
    },
    fetch: function (filter, cb) {
      var history = {};

      function fetchResults(history) {
        d3.xml(
          this.queryBuilder().setHistory(history).getFetchQuery(filter), cb
        );
      }

      d3.json(
        Resource.queryBuilder().setHistory(true).getSearchQuery(filter),
        function (err, data) {
          if (err) {
            throw err;
          }

          fetchResults.bind(Resource)({
            key: data.esearchresult.querykey,
            env: data.esearchresult.webenv
          });
        }
      );
    },
    getResultCount: function (result) {
      if (result && result.esearchresult) {
        return result.esearchresult.count;
      } else {
        return 0;
      }
    },
    getTrends: function (filter, cb) {
      var year = filter.begin,
          trends = [],
          remaining = 0;

      function callbackForYear(year) {
        return function (err, data) {
          if (err) {
            throw err;
          }
          trends.push({
            year: year,
            count: +Resource.getResultCount(data)
          });
          // If it's possible to use promise (i.e. modern browsers)
          // this could be done by Promise.all
          remaining -= 1;
          if (remaining <= 0) {
            cb(trends.sort(function (trend1, trend2) {
              return trend1.year - trend2.year;
            }));
          }
        };
      }

      for (; year <= filter.end; year += 1, remaining += 1) {
        Resource.search(
          {
            term: filter.term,
            begin: year,
            end: year
          },
          callbackForYear(year)
        );
      }
    }
  };
}());
