from django.urls import path
from .views import *

app_name = 'api/v1'
urlpatterns = [
    path('login/', CustomObtainAuthToken.as_view(), name='login'),
    path('profile/',ProfileApiView.as_view(), name='profile'),


]
