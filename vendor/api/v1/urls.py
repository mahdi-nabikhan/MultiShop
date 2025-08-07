from django.urls import path
from .views import *
app_name = 'api/v1'

urlpatterns = [
    path('manager/register/',ManagerRegisterAPIView.as_view(),name='register'),


]