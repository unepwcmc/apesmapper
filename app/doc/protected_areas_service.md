<link href="http://kevinburke.bitbucket.org/markdowncss/markdown.css" rel="stylesheet"></link>

Protected areas API
===================

This api provides information about protected areas polygons


** Getting proceted area **

To know if there is a protected area given a point (lat, lon):

    $ curl /api2/sites/search_by_point/:lng/:lat


** Getting protected area info **

With this call you get the polygon for the protected area with id 776. It returns a GeoJSON:

    $ curl  http://protectedplanet.net/api2/sites/776/geom
    {
        "official": true, 
        "site_id": "776", 
        "the_geom": {
            "coordinates": [
                [
                    [
                        128.047689574, 
                        35.760788220999999
                    ], 
                    [
                        128.04150450500001, 
                        35.760771060000103
                    ], 
         ....
     }


Optionally you can pass two params:

    * official: boolean, defaults to true
    * simplification: float, the tolerance to simplify the PA. Default is 0.05






