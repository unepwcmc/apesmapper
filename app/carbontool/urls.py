from django.conf.urls.defaults import *
from django.views.generic.simple import redirect_to

import views

urlpatterns = patterns('',
    url(r'^work$', views.work, name='api_work'),
    url(r'^work/(?P<work_hash>[a-zA-Z0-9]+)$', views.work, name='api_work'),
    url(r'^proxy/(?P<host>.*)$', views.proxy, name='api_proxy'),
    url(r'^error$', views.error, name='api_error'),
    url(r'^error/text$', views.errors),
)

