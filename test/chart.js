describe('Chart', function () {
  it('is a factory thaht generates a chart handler', function () {
    expect(Chart() !== undefined).toBe(true);
  });
  it('has addChartInto to create charts', function () {
    expect(Chart().addChartInto !== undefined).toBe(true);
  });
  describe('addChartInto', function () {
    beforeEach(function () {
      document.querySelector('body').innerHTML = '<div id="mockChart"></div>';
    });
    it('adds a svg chart to the element with the provided id', function () {
      Chart().addChartInto('mockChart');
      expect(document.getElementById('mockChart').innerHTML.indexOf('svg') !== -1)
      .toBe(true);
    });
    afterEach(function () {
      document.querySelector('body').innerHTML = '';
    });
  });
  it('has udpate to redraw the chart', function () {
    expect(Chart().update !== undefined).toBe(true);
  });
});
