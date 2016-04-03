describe('Resource', function () {
  describe('queryBuilder', function () {
    var queryBuilder;
    beforeEach(function () {
      queryBuilder = Resource.queryBuilder({
        db: 'http://aaa',
        search: 'http://bbb'
      });
    });
    it('generate a query to lis db in NBCI', function () {
      expect(queryBuilder.getDbQuery()).toBe('http://aaa');
    })
    it('generate a query to search UID in NBCI', function () {
      expect(
        queryBuilder.getSearchQuery({
          term: 'ccc',
          begin: 2015,
          end: 2016
        })
      ).toEqual('http://bbb?db=pubmed&term=ccc&mindate=2015/01/01&maxdate=2016/12/31&retmode=json');
      expect(
        queryBuilder.getSearchQuery({
          term: 'ccc',
          end: 2016
        })
      ).toEqual('http://bbb?db=pubmed&term=ccc&maxdate=2016/12/31&retmode=json');
      expect(
        queryBuilder.getSearchQuery({
          term: 'cc cc',
          end: 2016
        })
      ).toEqual('http://bbb?db=pubmed&term=cc+cc&maxdate=2016/12/31&retmode=json');
    })
  });
  describe('get', function () {
    var oldJson;
    beforeEach(function () {
      oldJson = d3.json;
      d3.json = new sinon.spy();
    });
    it('calls d3 json ajax call', function () {
      Resource.get('a', 'cb');
      expect(d3.json.calledWith('a', 'cb')).toBe(true);
    });
    afterEach(function () {
      d3.json = oldJson;
    });
  });
  describe('search', function () {
    var oldJson;
    beforeEach(function () {
      oldJson = d3.json;
      d3.json = new sinon.spy();
    });
    it('calls d3 json ajax call witch esearch command', function () {
      Resource.search({term: 'a'}, 'cb');
      expect(d3.json.calledWith('http://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=a&retmode=json', 'cb')).toBe(true);
    });
    afterEach(function () {
      d3.json = oldJson;
    });
  });
  describe('getResultCount', function () {
    it('extarct trends count from an esearch json response', function () {
      expect(
        Resource.getResultCount({
          esearchresult: {count: 4}
        })
      ).toBe(4);
    });
    it('when empty response it returns 0 count', function () {
      expect(Resource.getResultCount()).toBe(0);
      expect(Resource.getResultCount({})).toBe(0);
    });
  });
  describe('fetch', function () {
    var oldJson;
    beforeEach(function () {
      oldJson = d3.json;
      d3.json = new sinon.spy();
    });
    it('calls d3 json ajax call witch efetch command', function () {
      Resource.fetch({term: 'a'}, 'cb');
      expect(d3.json.callCount === 1).toBe(true);
    });
    afterEach(function () {
      d3.json = oldJson;
    });
  });
});

