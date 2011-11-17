# -*- encoding: utf-8 -*-

import os
from datetime import datetime

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

    class Error(models.Model):
        error = models.TextField(default='')
        when = models.DateTimeField(default=datetime.now)

        @staticmethod
        def track(log):
            Error(error=log).save();

        @staticmethod
        def latest():
            return Error.objects.order_by('-when')[:10]


else:
    from models_appengine import *

