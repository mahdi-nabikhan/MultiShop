# tests/test_customer_serializers.py
import pytest
from django.contrib.auth import get_user_model
from customer.models import Customer, Address, Comments
from website.models import Product, Category
from order.models import Order, OrderItem
from customer.api.v1.serializers import (
    CustomerRegisterSerializer,
    AddressSerializer,
    CommentSerializer,
    ProductRateSerializer,
    CustomerDetailSerializer
)
from vendor.models import *

User = get_user_model()


@pytest.mark.django_db
class TestCustomerSerializers:
    """
Test suite for Customer-related serializers in API v1.

This module contains unit tests to validate the behavior of serializers
for Customer, Address, Comments, ProductRate, and CustomerDetail.

Setup
-----
The `setup_data` fixture prepares the following objects for all tests:
    - A User and associated Customer.
    - A Category and a Store for product association.
    - A Product linked to the Store and Category.
    - An Order and OrderItem for testing product rating validation.

Tests
-----
1. test_customer_register_serializer:
    - Validates CustomerRegisterSerializer for creating a new Customer and nested User.
    - Ensures username and email are correctly saved.

2. test_address_serializer_create_and_representation:
    - Validates AddressSerializer creation and to_representation method.
    - Ensures that the customer is automatically assigned from request.user.
    - Confirms that nested CustomerSerializer output is correct.

3. test_comment_serializer_create_and_representation:
    - Validates CommentSerializer creation and to_representation method.
    - Ensures comment is associated with the correct Customer and Product.
    - Checks that the default status is 'P'.
    - Confirms nested user representation is correct.

4. test_product_rate_serializer_validation_and_create:
    - Validates ProductRateSerializer, ensuring only purchased products can be rated.
    - Checks that rate value and product association are correctly saved.

5. test_customer_detail_serializer:
    - Validates CustomerDetailSerializer serialization.
    - Confirms that username and user ID are correctly represented.

General Notes
-------------
- All tests use `@pytest.mark.django_db` for database access.
- `rf` (RequestFactory) is used to simulate requests where necessary for context.
- Serializer context must include `request` (and `product` or `pk` when needed).
- Tests ensure correct creation, validation, and serialization of nested fields.
- Provides a foundation for testing additional edge cases, e.g., invalid input or missing context.
"""


    @pytest.fixture
    def setup_data(self):
        user = User.objects.create_user(email="user@example.com", password="password123")
        customer = Customer.objects.create(user=user, username="testuser")
        category = Category.objects.create(title="Test Category", image="test.jpg", description="desc")
        
        manager_user=User.objects.create_user(email="manger@example.com", password="password123")
        manager=Manager.objects.create(first_name='f',last_name='f',user=manager_user)
        store=Store.objects.create(manager=manager,description='sag',name='sag shop')
        product = Product.objects.create(
            name="Test Product",
            description="desc",
            quantity_in_stock=10,
            price=100,
            category=category,
            store=store
        )
        order = Order.objects.create(customer=customer)
        OrderItem.objects.create(order=order, product=product, quantity=1, status='P', total=100)

        return {
            "user": user,
            "customer": customer,
            "category": category,
            "product": product,
            "order": order
        }

    def test_customer_register_serializer(self, setup_data):
        user_data = {"email": "newuser@example.com", "password": "S3cureP@ssw0rd!", 'password2': 'S3cureP@ssw0rd!'}
        data = {"username": "newcustomer", "user": user_data}
        serializer = CustomerRegisterSerializer(data=data, context={"request": None})
        assert serializer.is_valid(raise_exception=True)
        customer = serializer.save()
        assert customer.username == "newcustomer"
        assert customer.user.email == "newuser@example.com"

    def test_address_serializer_create_and_representation(self, setup_data, rf):
        request = rf.post("/fake-url/")
        request.user = setup_data["user"]
        data = {"street": "123 Test St", "city": "Test City", "state": "Test State", "postal_code": "12345"}
        serializer = AddressSerializer(data=data, context={"request": request})
        assert serializer.is_valid(raise_exception=True)
        address = serializer.save()
        rep = serializer.to_representation(address)
        assert rep["customer"]["username"] == "testuser"
        assert rep["city"] == "Test City"

    def test_comment_serializer_create_and_representation(self, setup_data, rf):
        request = rf.post("/fake-url/")
        request.user = setup_data["user"]
        serializer = CommentSerializer(data={"descriptions": "Nice product!"}, context={"request": request, "product": setup_data["product"]})
        assert serializer.is_valid(raise_exception=True)
        comment = serializer.save()
        rep = serializer.to_representation(comment)
        assert rep["user"]["email"] == setup_data["user"].email
        assert comment.product == setup_data["product"]
        assert comment.status == "P"

    def test_product_rate_serializer_validation_and_create(self, setup_data, rf):
        request = rf.post("/fake-url/")
        request.user = setup_data["user"]
        serializer = ProductRateSerializer(data={"rate": 5}, context={"request": request, "pk": setup_data["product"].id})
        assert serializer.is_valid(raise_exception=True)
        rate = serializer.save()
        assert rate.rate == 5
        assert rate.product == setup_data["product"]

    def test_customer_detail_serializer(self, setup_data):
        serializer = CustomerDetailSerializer(setup_data["customer"])
        data = serializer.data
        assert data["username"] == "testuser"
        assert data["user"] == setup_data["user"].id
