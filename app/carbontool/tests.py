"""
This file demonstrates two different styles of tests (one doctest and one
unittest). These will both pass when you run "manage.py test".

Replace these with more appropriate tests for your application.
"""

from django.test import TestCase
import json

TEST_POLY = """{"polygons":[[[-1.4170918294416264,23.148193359375],[-1.6806671337507222,25.125732421875],[-3.743671274749718,24.290771484375]]]}"""
class APITest(TestCase):

    def test_update_work(self):
        response = self.client.post('/api/v0/work', {});
        self.assertEquals(200, response.status_code)
        data = json.loads(response.content)
        self.assertNotEqual(None, data['id'])

        response = self.client.put('/api/v0/work/' + data['id'], json.dumps([
            {
                'polygons': ['test', 'test', 'test']
            },
            {
                'polygons': ['test', 'test', 'test'],
                'moredata': 'jajaja, rambo FTW'
            }
        ]), 'application/json')
        self.assertEquals(200, response.status_code)
        data = json.loads(response.content)


class StatsTests(TestCase):
    
    def test_stats_post(self):
        """ stats should a valid json """
        response = self.client.post('/api/v0/stats', TEST_POLY, 'application/json');
        self.assertEquals(200, response.status_code)
        data = json.loads(response.content)

        self.assertTrue('carbon' in data)
        self.assertTrue('qty' in data['carbon'])
        self.assertTrue('by_country' in data['carbon'])

        self.assertTrue('restoration_potential' in data)
        self.assertTrue('covered_by_PA' in data)
        self.assertTrue('covered_by_KBA' in data)
        self.assertTrue('forest_status' in data)

