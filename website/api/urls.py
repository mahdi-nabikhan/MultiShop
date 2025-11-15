from django.urls import path,include
from .views import *

app_name='api/v1'


urlpatterns=[
    path('products/random/', RandomProductsApiView.as_view(), name='random-products'),
    
]