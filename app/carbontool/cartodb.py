
import urllib
import urllib2
import json

SQL_CARBON = """
SELECT intersects_sum, within_sum FROM (SELECT SUM((pvc).value * (pvc).count) AS intersects_sum FROM (SELECT ST_ValueCount(ST_AsRaster((intersection).geom, 0.0089285714, -0.0089285714, NULL, NULL, ARRAY['32BSI'], ARRAY[(intersection).val])) AS pvc FROM (SELECT (ST_Intersection(rast, the_geom)) AS intersection FROM carbon, (SELECT ST_GeomFromText('%(polygon)s',4326) AS the_geom) foo WHERE ST_Intersects(rast, the_geom) AND ST_Within(rast, the_geom) = false) bar) AS foo WHERE (pvc).value > 0 and (pvc).value != 2147483647) intersects,(SELECT SUM((ST_SummaryStats(rast)).sum) AS within_sum FROM carbon, (SELECT ST_GeomFromText('%(polygon)s',4326) AS the_geom) foo WHERE ST_Within(rast, the_geom)) within;
"""
# should return "rows":[{"intersects_sum":5818935663,"within_sum":57668562021}]}

#TODO add support for multiploygon
def polygon_text(p):
    """
        get a polygon, close it and reverse the lat,lon
        >>> polygon_text([[1,2], [3,4]])
        'POLYGON((2.000000 1.000000,4.000000 3.000000, 2.000000 1.000000))'
    """
    return 'POLYGON((' + ','.join('%f %f' % tuple(reversed(x)) for x in p + [p[0]]) + '))'

class CartoDB(object):
    """ wrapper over cartobd api """

    def __init__(self):
      self.resource_url = 'https://carbon-tool.cartodb.com/api/v1/sql/'

    def sql(self, sql):
        p = urllib.urlencode({'q': sql})
        f = urllib2.urlopen(self.resource_url, p);
        return f.read();

    def carbon(self, polygon):
        carbon = json.loads(self.sql(SQL_CARBON % {'polygon': polygon}))
        import pdb; pdb.set_trace()
        row = carbon['rows'][0]
        return int(row['intersects_sum']) + int(row['within_sum'] or 0)

if __name__ == '__main__':
    c = CartoDB()
    print c.carbon('POLYGON((-77.7 -1.5, -65.9 -1.5, -65.9 3.1, -77.7 3.1, -77.7 -1.5))')


