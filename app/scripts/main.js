'use strict';

var State = {
  filter: {
    term: '',
    begin: new Date().getFullYear(),
    end: new Date().getFullYear(),
    timeSpan: 'm'
  },
  trends: []
};

