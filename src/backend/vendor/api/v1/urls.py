from django.urls import path
from .views import *

app_name = 'api/v1'

urlpatterns = [
    path('manager/register/', ManagerRegisterAPIView.as_view(), name='manager-register'),
    path('admin/register/', AdminRegisterAPIView.as_view(), name='admin-register'),
    path('add/product/', AddProductAPIView.as_view(), name='add-product'),
    path('detail/product/<int:pk>/', ProductDetailAPIView.as_view(), name='detail-product'),
    path('all/product/shop/',AllProductShopApiView.as_view(),name='all-product-shop'),
    path('operator/register/', OperatorRegisterAPIView.as_view(), name='operator-register'),
    path('add/product/image/<int:pk>/',AddProductImageAPIView.as_view(), name='add-product-image'),
    path('add/product/discount/<int:pk>/',AddProductsDiscountAPIView.as_view(),name='add-discount-products'),
    path('update/orderitem/<int:pk>/',OrderItemUpdateStatusApiView.as_view(),name='update_orderitem_shop'),
    path('store/detail/',StoreDetailAndDelete.as_view(),name='store_detail'),
    path('store/user/roles/',ManagerAndOperatorUserRoleAPIViews.as_view(),name='store-user-role'),
    path('shop/list/order/',ShopOrderListAPIView.as_view(),name='order_list_shop'),
    path('delete/discount/<int:pk>/',DeleteProductDiscount.as_view(),name = 'delete_discount'),
    path('shop/admin/list/',ShopAdminListAPIView.as_view(),name='admin-list'),
    path('shop/operator/list',ShopOperatorListApiView.as_view(),name='oprator-list'),
    path('shop/admin/detail/<int:pk>/',ShopAdminDetailAPIView.as_view(),name='admin-detail'),
    path('shop/operator/detail/<int:pk>/',ShopOperatorDetailAPIView.as_view(),name='admin-detail'),
    path('add/image/product/<int:pk>/',VendorAddProductImageApiView.as_view(),name='add-product-images'),
    path('store/category/',ListStoreCategoryAPIView.as_view(),name='list-category'),
    path('list/category/store/<int:pk>/',StoreRelatedWithCategory.as_view(),name='store-related-catgory')
    

]
