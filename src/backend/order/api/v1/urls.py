from django.urls import path
from order.api.v1 import views

app_name = 'order_api_vi'
urlpatterns = [
    path('orders/', views.OrderListApiView.as_view(), name='order-list'),
    path('order/item/<int:pk>/',views.OrderItemCreateApiView.as_view(), name='order-item-create'),
    path('order/item/list/<int:pk>/',views.OrderItemListAPIView.as_view(),name='order-item-list'),
    path('order/item/detail/<int:pk>/',views.OrderItemDetailView.as_view(),name='order_item_detail'),
    path('shop/order/items/',views.ShopOrderListApiView.as_view(),name='shop_order_item'),
    path('order/item/',views.OrderItemApiView.as_view(),name='customer_order_item'),
    path('create/bill/<int:pk>/',views.BillCreationApiView.as_view(),name='bill-creation'),
    path('sessions/cart/',views.CartDetailAPIView.as_view(),name='session-cart'),
    path('session/cart/add/<int:pk>/',view=views.CartAddAPIView.as_view(),name='sessions-cart-add'),
    path('related/order/orderitem/<int:pk>/',view=views.RelatedOrderItemWithOrder.as_view(),name='ralated_orderitem_order')


]
"""
Order module API URL configuration.

This module defines all API endpoints related to Orders, OrderItems, and Bills
for both customers and store managers.

Namespace: 'order_api_vi'

Endpoints
---------
1. Orders
   - GET /orders/  -> List all orders of the authenticated customer (OrderListApiView)
   - POST /orders/ -> Create a new order for the authenticated customer (OrderListApiView)

2. Order Items
   - POST /order/item/<int:pk>/ -> Add an item to an order for product with ID=<pk> (OrderItemCreateApiView)
   - GET /order/item/list/<int:pk>/ -> List all items for order with ID=<pk> (OrderItemListAPIView)
   - GET, PUT, PATCH, DELETE /order/item/detail/<int:pk>/ -> Retrieve or modify an order item with ID=<pk> (OrderItemDetailView)
   - GET /shop/order/items/ -> List all order items for products managed by the authenticated store manager (ShopOrderListApiView)
   - GET /order/item/ -> List all active order items for the authenticated customer (OrderItemApiView)

3. Bills
   - POST /create/bill/<int:pk>/ -> Create a bill for order with ID=<pk> (BillCreationApiView)

Notes
-----
- All endpoints require authentication; store manager endpoints should only be accessed by users with a managed store.
- Nested serializers are used in many views to include detailed product or order information.
- Typical usage:
    - Customer views: orders, active order items, creating bills
    - Manager views: listing order items of managed products

Usage Example
-------------
from django.urls import reverse

# List all orders for the authenticated customer
reverse('order_api_vi:order-list')

# Add an item to a specific order
reverse('order_api_vi:order-item-create', args=[product_id])

# Create a bill for an order
reverse('order_api_vi:bill-creation', args=[order_id])
"""
