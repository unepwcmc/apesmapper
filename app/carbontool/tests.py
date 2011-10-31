"""
This file demonstrates two different styles of tests (one doctest and one
unittest). These will both pass when you run "manage.py test".

Replace these with more appropriate tests for your application.
"""

from django.test import TestCase
import json

class APITest(TestCase):

    def test_create_work(self):
        response = self.client.post('/api/v0/work', {});
        self.assertEquals(200, response.status_code)
        data = json.loads(response.content)
        self.assertNotEqual(None, data['id'])

    def test_update_work(self):
        response = self.client.put('/api/v0/work', json.dumps([
            {
                'polygons': ['test', 'test', 'test']
            },
            {
                'polygons': ['test', 'test', 'test'],
                'moredata': 'jajaja, rambo FTW'
            }
        ]), 'appilication/json')
        self.assertEquals(200, response.status_code)
        data = json.loads(response.content)


