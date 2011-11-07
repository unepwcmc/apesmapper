# Django settings for carbontool project.
import os
import logging

PRODUCTION = False
if 'SERVER_SOFTWARE' in os.environ and os.environ['SERVER_SOFTWARE'].startswith('Google App Engine'):
    PRODUCTION = True


DEBUG = True #not PRODUCTION
TEMPLATE_DEBUG = DEBUG
PROJECT_PATH = os.path.abspath(os.path.dirname(__file__))

ADMINS = (
    ('javi santana', 'jsantana@vizzuality.com'),
)

MANAGERS = ADMINS

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'carbontool.db',                      # Or path to database file if using sqlite3.
        'USER': '',                      # Not used with sqlite3.
        'PASSWORD': '',                  # Not used with sqlite3.
        'HOST': '',                      # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '',                      # Set to empty string for default. Not used with sqlite3.
    }
}

if PRODUCTION:
    DATABASES = {}

TIME_ZONE = 'America/Chicago'
LANGUAGE_CODE = 'en-us'
SITE_ID = 1
USE_I18N = False
USE_L10N = False
MEDIA_ROOT = os.path.join(PROJECT_PATH, "public");
MEDIA_URL = ''
ADMIN_MEDIA_PREFIX = '/media/'
SECRET_KEY = 'q#xh5uekb(zfkx)*1abt4q8m42l*&m#ql@pnwn09912*5875#2'

TEMPLATE_LOADERS = (
    'django.template.loaders.filesystem.Loader',
    'django.template.loaders.app_directories.Loader',
#     'django.template.loaders.eggs.Loader',
)

MIDDLEWARE_CLASSES = (
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.middleware.gzip.GZipMiddleware'
)

ROOT_URLCONF = 'urls'

TEMPLATE_DIRS = (
    os.path.join(PROJECT_PATH, "templates"),
    os.path.join(PROJECT_PATH, "public"),
)

INSTALLED_APPS = (
    'django.contrib.contenttypes',
    'carbontool'
)
if DEBUG:
    logging.basicConfig(
        level = logging.DEBUG,
        format = '%(asctime)s %(levelname)s %(message)s',
    )
