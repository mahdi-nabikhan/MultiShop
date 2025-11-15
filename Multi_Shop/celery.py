import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Mult_Shop.settings")

app = Celery("Mult_Shop")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
