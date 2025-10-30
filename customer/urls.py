from django.urls import path,include
from .views import *
app_name='customer'
urlpatterns=[
    path('api/v1/',include('customer.api.v1.urls')),
    path('regsiter/',CostumerRegisterTemplateView.as_view(),name='ش'),
    path('customer/profile/',CustomerProfileTemplateView.as_view(),name='profile'),
    path('detail/address/',AddressDetailTemplateView.as_view(),name='address_detail'),
    path('detail/comments/',CommentDetailTemplateView.as_view(),name='comments-detail'),
    path('order/item/detail/',CustomerOrderItemTemplateView.as_view(),name='order-item-detail')
]