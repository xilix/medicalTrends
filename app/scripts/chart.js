var Chart = (function () {
  'use strict';

  return function () {
    var ChartHandler = {
      setBarWidth: function (barWidth) {
        ChartHandler.barWidth = barWidth;

        return ChartHandler;
      },
      update: function (trends) {
        var bars;
        if (!ChartHandler.svg) {
          throw 'no target chart defined';
        }
        ChartHandler.y.domain([
          0,
          d3.max(trends, function (d) {
            return d.count;
          })
        ]);
        ChartHandler.x.domain([
          d3.min(trends, function (d) {
            return d.year;
          }),
          d3.max(trends, function (d) {
            return d.year;
          })
        ]);

        ChartHandler.xAxis
        .ticks(trends.length);

        ChartHandler.svg.selectAll('.x.axis').remove();

        ChartHandler.svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + ChartHandler.height + ')')
        .call(ChartHandler.xAxis);

        ChartHandler.svg.selectAll('.y.axis').remove();

        ChartHandler.svg.append('g')
        .attr('class', 'y axis')
        .call(ChartHandler.yAxis);

        bars = ChartHandler.svg.selectAll('.bar')
        .data(trends);
        bars.exit().remove()
        bars.transition()
          .attr('x', function (d) {
            return ChartHandler.x(d.year) - ChartHandler.barWidth / 2;
          })
          .attr('y', function (d) {
            return ChartHandler.y(d.count);
          })
          .attr('height', function (d) {
            return ChartHandler.height - ChartHandler.y(d.count);
          });
        bars.enter()
          .append('rect')
          .attr('class', 'bar')
          .attr('x', function (d) {
            return ChartHandler.x(d.year) - ChartHandler.barWidth / 2;
          })
          .attr('width', ChartHandler.barWidth)
          .attr('y', function (d) {
            return ChartHandler.y(d.count);
          })
          .attr('height', function (d) {
            return ChartHandler.height - ChartHandler.y(d.count);
          });

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
          [ChartHandler.barWidth / 2, ChartHandler.width - ChartHandler.barWidth / 2]
        );

        ChartHandler.y = d3.scale.linear()
        .range([ChartHandler.height, 0]);

        ChartHandler.xAxis = d3.svg.axis()
        .scale(ChartHandler.x)
        .tickFormat(d3.format('d'))
        .orient('bottom');

        ChartHandler.yAxis = d3.svg.axis()
        .scale(ChartHandler.y)
        .tickFormat(d3.format('e'))
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

