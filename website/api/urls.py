from django.urls import path,include
from .views import *

app_name = "webste_api_v1" 


urlpatterns=[
    path('products/random/', RandomProductsApiView.as_view(), name='random-products'),
    path('product/filtering/',ProductsFilteringAPIView.as_view(),name='product_filter'),
    path("search/", ProductSearchApi.as_view(), name="product-search"),
    path("autocomplete/", AutoCompleteApi.as_view(), name="product-autocomplete"),
]