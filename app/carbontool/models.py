# -*- encoding: utf-8 -*-

import os

if 'SERVER_SOFTWARE' in os.environ and os.environ['SERVER_SOFTWARE'].startswith('Dev'):

    from django.db import models

    class Work(models.Model):
        json = models.TextField(default='[]')

        @staticmethod
        def get_by_id(id):
            return Work.objects.get(pk=id)

        def put(self):
            self.save()

        def unique_id(self):
            return self.id


else:
    from models_appengine import *

