from django.urls import path
from .views import *

app_name = 'api/v1'
urlpatterns = [
    path('customer/register/', CustomerRegisterApiView.as_view(), name='customer-register'),
    path('add/address/', AddAddressApiView.as_view(), name='add-address'),
    path('detail/address/<int:pk>/', DetailAddressApiView.as_view(), name='detail-address'),
    path('add/comment/<int:pk>/',CustomerAddCommentsApiView.as_view(), name='add-comment'),
    path('all/comments/',CustomerCommentsApiView.as_view(), name='all-comments'),
    path('detail/comment/<int:pk>/',CommentDetailApiView.as_view(), name='detail-comment'),
    path('add/product/rate/<int:pk>/',AddProductRateAPIView.as_view(),name='add_product_rate'),
    path('all/products/comments/<int:pk>/',AllProductsCommentApiView.as_view(),name='products-comments'),
    path('customer/detail/',CustomerDetailApiView.as_view(),name='customer_detail'),
    path("product/<int:pk>/can-rate/", CanRateAPIView.as_view(), name="can-rate"),

]
