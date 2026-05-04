from django.urls import path, include
from .views import *

app_name = 'order'
"""
Order app URL configuration.

This module defines URL patterns for the "order" app, including both API endpoints
and template-based views for managing orders, order items, and shopping cart.

URL namespaces:
    - 'order_api_vi': REST API v1 endpoints for order and order items.
    - Template views: customer order item list, cart add/delete, and shop order list.

URL Patterns:
    api/v1/                 -> Includes order.api.v1.urls (API v1 endpoints)
    orders/                 -> OrderDetailView (Template view for order details)
    order/item/<int:pk>/    -> CartAddView (Add product to cart by product ID)
    order/item/delete/<int:id>/ -> CartDeleteView (Delete product from cart by cart ID)
    shop/order/list/        -> ShopOrderTemplateView (Template view for shop's orders)
    customer/order/item/    -> CustomerOrderitemTemplateView (Template view for customer's order items)
"""

urlpatterns = [
    path('api/v1/', include('order.api.v1.urls'), name='order_api_vi'),
    path('orders/', OrderDetailView.as_view(), name='order-detail'),
    path('order/item/<int:pk>/', CartAddView.as_view(), name='cart-add'),
    path('order/item/delete/<int:id>/', CartDeleteView.as_view(), name='cart-delete'),
    path('shop/order/list/', ShopOrderTemplateView.as_view(), name='order-list-shop'),
    path('customer/order/item/', CustomerOrderitemTemplateView.as_view(), name='customer_order_item')
]

urlpatterns = [
    path('api/v1/', include('order.api.v1.urls'),name='order_api_vi'),
    path('orders/',OrderDetailView.as_view(),name='order-detail'),
    path('order/item/<int:pk>/',CartAddView.as_view(),name='cart-add'),
    path('order/item/delete/<int:id>/',CartDeleteView.as_view(),name='cart-delete'),
    path('shop/order/list/', ShopOrderTemplateView.as_view(), name='order-list-shop'),
    path('customer/order/item/',CustomerOrderitemTemplateView.as_view(),name='customer_order_item')
    


]
