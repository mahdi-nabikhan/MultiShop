from django.urls import path
from .views import *

app_name = 'api/v1'
"""
URL configuration for the API v1 of the account module.

This module defines REST API endpoints related to customer registration,
profile management, address management, comments, and product ratings.

API Endpoints:

Customer Management:
    - customer/register/ (POST):
        Register a new customer.
    - customer/detail/ (GET):
        Retrieve the authenticated customer's profile details.

Address Management:
    - add/address/ (GET, POST):
        List all addresses of the authenticated customer or add a new address.
    - detail/address/<int:pk>/ (GET, PUT, PATCH, DELETE):
        Retrieve, update, partially update, or delete a specific address.

Comments Management:
    - add/comment/<int:pk>/ (POST):
        Add a comment to a specific product.
    - all/comments/ (GET):
        Retrieve all comments made by the authenticated customer.
    - detail/comment/<int:pk>/ (GET, PUT, PATCH, DELETE):
        Retrieve, update, partially update, or delete a specific comment.
    - all/products/comments/<int:pk>/ (GET):
        Retrieve all comments associated with a specific product.

Product Ratings:
    - add/product/rate/<int:pk>/ (POST):
        Add a rating for a specific product.
    - product/<int:pk>/can-rate/ (GET):
        Check if the authenticated customer can rate a specific product
        (requires a purchase of the product).

Design Notes:
    - All endpoints are prefixed with the `api/v1/` namespace for versioning.
    - Authentication is required for customer-specific operations.
    - Proper serializer validation ensures data integrity and security.
"""
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
