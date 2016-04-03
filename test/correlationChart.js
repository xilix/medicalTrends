describe('CorrelationChart', function () {
  it('is a factory thaht generates a chart handler', function () {
    expect(CorrelationChart() !== undefined).toBe(true);
  });
  it('has addChartInto to create charts', function () {
    expect(CorrelationChart().addChartInto !== undefined).toBe(true);
  });
  describe('addChartInto', function () {
    beforeEach(function () {
      document.querySelector('body').innerHTML = '<div id="mockChart"></div>';
    });
    it('adds a svg chart to the element with the provided id', function () {
      CorrelationChart().addChartInto('mockChart');
      expect(document.getElementById('mockChart').innerHTML.indexOf('svg') !== -1)
      .toBe(true);
    });
    afterEach(function () {
      document.querySelector('body').innerHTML = '';
    });
  });
  it('has udpate to redraw the chart', function () {
    expect(CorrelationChart().update !== undefined).toBe(true);
  });
});
