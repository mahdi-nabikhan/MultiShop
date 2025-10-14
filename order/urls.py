from django.urls import path, include
from .views import *

app_name = 'order'
urlpatterns = [
    path('api/v1/', include('order.api.v1.urls')),
    path('orders/',OrderDetailView.as_view(),name='order-detail'),
    path('order/item/<int:id>/',CartAddView.as_view(),name='cart-add'),
    path('order/item/delete/<int:id>/',CartDeleteView.as_view(),name='cart-delete'),
    path('shop/order/list/', ShopOrderTemplateView.as_view(), name='order-list-shop')


]
