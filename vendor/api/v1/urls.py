from django.urls import path
from .views import *

app_name = 'api/v1'

urlpatterns = [
    path('manager/register/', ManagerRegisterAPIView.as_view(), name='manager-register'),
    path('admin/register/', AdminRegisterAPIView.as_view(), name='admin-register'),
    path('add/product/', AddProductAPIView.as_view(), name='add-product'),
    path('detail/product/<int:pk>/', ProductDetailAPIView.as_view(), name='detail-product'),
    path('all/product/shop/',AllProductShopApiView.as_view(),name='all-product-shop'),

]
