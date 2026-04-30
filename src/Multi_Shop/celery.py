import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "Multi_Shop.settings")

app = Celery("Multi_Shop")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()
