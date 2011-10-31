
# GOOGLE STUFF
from google.appengine.ext import db

class Work(db.Model):
    json = db.TextProperty(default='[]')
    
    def unique_id(self):
        return self.key.id()
    
