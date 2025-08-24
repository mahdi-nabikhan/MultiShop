from django.urls import path
from order.api.v1 import views

app_name = 'order_api_vi'
urlpatterns = [
    path('orders/', views.OrderListApiView.as_view(), name='order-list'),
    path('order/item/<int:pk>/',views.OrderItemCreateApiView.as_view(), name='order-item-create'),


]
