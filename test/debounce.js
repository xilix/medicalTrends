describe('Debounce', function () {
  it('returns a function that executes callback after timing ms', function (done) {
    var count = 0, debouncer;
    debouncer = Debounce(function () {
      count += 1;
      expect(count).toBe(1);
      done()
    }, 100);
    debouncer();
  });
  it('has a debounce behaviour', function (done) {
    var count = 0, debouncer;
    debouncer = Debounce(function () {
      count += 1;
      expect(count).toBe(1);
      done()
    }, 100);
    debouncer();
    debouncer();
  });
});
