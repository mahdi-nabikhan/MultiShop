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
"""
URL configuration for the Customer app.

This module defines the routing for both API and Template-based views
related to the Customer functionality.

Structure
---------
1. API URLs:
    - Includes versioned API endpoints from 'customer.api.v1.urls'.
    - Prefix: 'api/v1/' for all REST API endpoints.

2. TemplateViews:
    - Customer registration page:
        path: 'regsiter/'  # Note: there seems to be a typo in 'register'
        view: CostumerRegisterTemplateView
        name: 'ش'
    - Customer profile page:
        path: 'customer/profile/'
        view: CustomerProfileTemplateView
        name: 'profile'
    - Customer address detail page:
        path: 'detail/address/'
        view: AddressDetailTemplateView
        name: 'address_detail'
    - Customer comments detail page:
        path: 'detail/comments/'
        view: CommentDetailTemplateView
        name: 'comments-detail'
    - Customer order item detail page:
        path: 'order/item/detail/'
        view: CustomerOrderItemTemplateView
        name: 'order-item-detail'

Notes
-----
- `app_name='customer'` allows namespacing URLs in templates and reverse lookups.
- Ensure that the template view names match their actual templates to prevent rendering issues.
- The 'regsiter/' path has a typo and should likely be 'register/' for consistency.
- API endpoints are kept separate under 'api/v1/' for versioning and maintainability.
- This structure supports both web UI (TemplateViews) and REST API access.
"""
