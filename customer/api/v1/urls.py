from django.urls import path
from .views import *

app_name = 'api/v1'
urlpatterns = [
    path('customer/register/', CustomerRegisterApiView.as_view(), name='customer-register'),
    path('add/address/', AddAddressApiView.as_view(), name='add-address'),
    path('detail/address/<int:pk>/', DetailAddressApiView.as_view(), name='detail-address')
]
