# -*- encoding: utf-8 -*-

"""
this module contains views that serve the REST-like API 
for client-side backbone application
"""

import logging
import json

from django.http import HttpResponse, Http404
from django.views.decorators.csrf import csrf_exempt

from baseconv import base62
from models import Work

from cartodb import CartoDB, polygon_text

BASE_ID = 123456
@csrf_exempt
def work(request, work_hash=None):

    status = 200
    work = None
    if work_hash:
        id = base62.to_decimal(work_hash)
        work = Work.get_by_id(id - BASE_ID)
        if not work:
            raise Http404

    # create work
    if request.method == "POST":
        w = Work()
        w.put();
        data = json.dumps({'id': base62.from_decimal(BASE_ID + w.unique_id())})

    # update
    elif request.method == "PUT":
        if work:
            work.json = request.raw_post_data
            work.put()
            data = request.raw_post_data
        pass
    # remove
    elif request.method == "DELETE":
        work.delete();
        status = 204
        data = ''
        pass
    # get
    else:
        data = work.json
        pass

    return HttpResponse(data, status=status, mimetype='application/json')

@csrf_exempt
def stats(request): 
    data = { 'error': 'you should use POST' }
    if request.method == "POST":
        polygons = json.loads(request.raw_post_data)['polygons']
        c = CartoDB()
        try:
            wkt = polygon_text(polygons)
            carbon = c.carbon(wkt)
            restoration = c.restoration_potential(wkt)
            forest = c.forest(wkt)
        except Exception as e:
            logging.error(e)
            data['error'] = str(e)
        else:
            data = {
                'carbon': {
                    'qty': carbon,
                    'by_country': [
                      {'name': 'Mexico', 'qty': 1234},
                      {'name': 'Spain', 'qty': 5678}
                      ],
                },
                'restoration_potential': restoration,
                #{
                      #'wide_scale': 12,
                      #'mosaic': 12,
                      #'remove': 12,
                      #'none': 14
                 #},
                 'covered_by_PA':  {
                    'percent': 90,
                    'num_overlap': 12
                 },
                 'covered_by_KBA':  {
                    'percent': 12,
                    'num_overlap': 34
                 },
                 'forest_status': forest
                 #{
                    #'intact': 12,
                    #'fragmented': 23,
                    #'partial': 34,
                    #'deforested': 14
                 #}
            }
    return HttpResponse(json.dumps(data), mimetype='application/json')




