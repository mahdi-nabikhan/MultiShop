from django.urls import path,include
from .views import *

app_name = "webste_api_v1" 


urlpatterns=[
    path('products/random/', RandomProductsApiView.as_view(), name='random-products'),
    path('product/filtering/',ProductsFilteringAPIView.as_view(),name='product_filter'),
    path("search/", ProductSearchApi.as_view(), name="product-search"),
    path("autocomplete/", AutoCompleteApi.as_view(), name="product-autocomplete"),
    path('product/list/<int:pk>',ProductListApiView.as_view(),name='product-list'),
    path('store/list',ListStoreApiView.as_view(),name='store-list'),
    path('product/detail/<int:pk>',ProductDetailAPIView.as_view(),name='product-detail'),
    path('store/detail/<int:pk>',StoreDetailApiView.as_view(),name='store-detail')
]