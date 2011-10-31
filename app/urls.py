from django.conf.urls.defaults import *
from django.conf import settings
from django.views.generic.simple import redirect_to, direct_to_template

# Uncomment the next two lines to enable the admin:
# from django.contrib import admin
# admin.autodiscover()

urlpatterns = patterns('',
    # Example:
    (r'^$', direct_to_template, {'template':'home.html'}),
    (r'^about$', direct_to_template, {'template':'about.html'}),
    (r'^tool$', direct_to_template, {'template':'index.html'}),
    (r'^api/v0/', include('carbontool.urls')),

    # Uncomment the admin/doc line below to enable admin documentation:
    # (r'^admin/doc/', include('django.contrib.admindocs.urls')),

    # Uncomment the next line to enable the admin:
    # (r'^admin/', include(admin.site.urls)),
    (r'^(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.MEDIA_ROOT}),
)
