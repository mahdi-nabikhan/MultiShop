from django.urls import path,include
from .views import *

urlpatterns=[
    path('api/v1/',include('customer.api.v1.urls')),
    path('regsiter/',CostumerRegisterTemplateView.as_view(),name='register'),
    path('customer/profile/',CustomerProfileTemplateView.as_view(),name='profile')

]