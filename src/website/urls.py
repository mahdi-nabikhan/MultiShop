from django.urls import path,include
from .views import *


urlpatterns = [
    path('api/v1/', include('website.api.urls'),name='webste_api_v1'),
    path('shop/list/', AllShopView.as_view(), name='shop-list'),
    path('product/list/<int:pk>/', StoreProductsViews.as_view(), name='product-list'),
    path('shop/detail/<int:pk>/',ShopDetailView.as_view(), name='shop-detail'),
    path('product/detail/<int:pk>/', ProductsDetailView.as_view(), name='product-detail')

]
