from django.urls import path
from .views import *
app_name='api/v1'
urlpatterns=[
    path('customer/register/',CustomerRegisterApiView.as_view(),name='customer-register')
]