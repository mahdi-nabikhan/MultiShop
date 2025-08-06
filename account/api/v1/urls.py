from django.urls import path
from .views import *

app_name = 'api/v1'
urlpatterns = [
    path('login/', CustomObtainAuthToken.as_view(), name='customer register'),


]
