var CorrelationChart = (function () {
  'use strict';

  d3.selection.prototype.moveToBack = function () {
    return this.each(function () {
      var firstChild = this.parentNode.firstChild;
      if (firstChild) {
        this.parentNode.insertBefore(this, firstChild);
      }
    });
  };

  return function () {
    var ChartHandler = {
      setBarWidth: function (barWidth) {
        ChartHandler.barWidth = barWidth;

        return ChartHandler;
      },
      clear: function () {
        ChartHandler.svg.selectAll('.dot').remove();
      },
      update: function (selectedTrend, trends) {
        var dots, trendsName, yearsSelected, countSelected,
            compareTrends = [],
            data = [];

        trendsName = Object.keys(trends);
        yearsSelected = selectedTrend.map(function (d) {
          return d.year;
        });
        countSelected = selectedTrend.map(function (d) {
          return d.count;
        });
        Object.keys(trends)
        .map(function (d) {
          return trends[d];
        })
        .forEach(function (trend) {
          trend.filter(function (d) {
            return yearsSelected.indexOf(d.year) !== -1;
          })
          .forEach(function (d, ind) {
            compareTrends.push([countSelected[ind], d.count]);
          });
        })

        if (!ChartHandler.svg) {
          throw 'no target chart defined';
        }
        ChartHandler.y.domain([
          d3.min(compareTrends, function (d) {
            return Math.min(d[0], d[1]);
          }),
          d3.max(compareTrends, function (d) {
            return Math.max(d[0], d[1]);
          })
        ]);
        ChartHandler.x.domain([
          d3.min(compareTrends, function (d) {
            return Math.min(d[0], d[1]);
          }),
          d3.max(compareTrends, function (d) {
            return Math.max(d[0], d[1]);
          })
        ]);

        ChartHandler.svg.selectAll('.x.axis').remove();

        ChartHandler.svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + ChartHandler.height + ')')
        .call(ChartHandler.xAxis);

        ChartHandler.svg.selectAll('.y.axis').remove();

        ChartHandler.svg.append('g')
        .attr('class', 'y axis')
        .call(ChartHandler.yAxis);

        dots = ChartHandler.svg.selectAll('.points')
        .data(compareTrends);
        dots.exit().remove()
        dots.transition()
        .attr('cx', function (d) {
          return ChartHandler.x(d[0]);
        })
        .attr('cy', function (d) {
          return ChartHandler.y(d[1]);
        })
        dots.enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('r', 3.5)
        .attr('cx', function (d) {
          return ChartHandler.x(d[0]);
        })
        .attr('cy', function (d) {
          return ChartHandler.y(d[1]);
        })
        .attr('fill', 'steelblue');

        ChartHandler.svg.selectAll('.x.axis').moveToBack();
        ChartHandler.svg.selectAll('.y.axis').moveToBack();

        return ChartHandler;
      },
      loading: function (loading) {
        ChartHandler.isLoading = loading;
        if (loading) {
          ChartHandler.svg.append('text')
          .attr('class', 'loading')
          .attr('x', Math.round(ChartHandler.width / 2))
          .attr('y', Math.round(ChartHandler.height / 2))
          .text('Loading');
        } else {
          ChartHandler.svg.selectAll('text.loading').remove();
        }

        return ChartHandler;
      },
      addChartInto: function (id) {
        var element, elementSize, margin;

        ChartHandler.element = document.getElementById(id);
        elementSize = ChartHandler.element.getBoundingClientRect();

        margin = {top: 20, right: 40, bottom: 30, left: 50};
        ChartHandler.width = elementSize.width - margin.left - margin.right;
        ChartHandler.height = elementSize.height - margin.top - margin.bottom;
        ChartHandler.barWidth = Math.floor(ChartHandler.width / 19) - 1;

        ChartHandler.x = d3.scale.linear()
        .range(
          [0, ChartHandler.width]
        );

        ChartHandler.y = d3.scale.linear()
        .range([ChartHandler.height, 0]);

        ChartHandler.xAxis = d3.svg.axis()
        .scale(ChartHandler.x)
        .tickFormat(d3.format('d'))
        .orient('bottom');

        ChartHandler.yAxis = d3.svg.axis()
        .scale(ChartHandler.y)
        .tickFormat(d3.format('d'))
        .orient('left')
        .tickSize(-ChartHandler.width);

        ChartHandler.svg = d3.select(ChartHandler.element).append('svg')
        .attr('width', ChartHandler.width + margin.left + margin.right)
        .attr('height', ChartHandler.height + margin.top + margin.bottom)
        .append('g')
        .attr('class', 'paths')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        return ChartHandler;
      }
    };
    return ChartHandler;
  };
}());

