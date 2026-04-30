# tests/test_customer_models.py
import pytest
from account.models import User
from customer.models import Customer, Address, Comments
from website.models import *
from vendor.models import *

@pytest.mark.django_db
class TestCustomerModels:
    """
Test suite for Customer-related models: Customer, Address, and Comments.

This module contains unit tests for validating the behavior and integrity of
Customer, Address, and Comments models in the system.

Tests included:

1. TestCustomerModels.setup_data:
    - Fixture to create initial test data for all tests.
    - Creates a User and associated Customer.
    - Creates a sample Category and Store for product association.
    - Creates a sample Product.
    - Creates a sample Address linked to the Customer.
    - Returns a dictionary of created objects for use in tests.

2. TestCustomerModels.test_customer_creation:
    - Validates that a Customer instance is correctly created.
    - Checks that `is_customer` flag is True.
    - Confirms that username and associated user email are correct.

3. TestCustomerModels.test_address_creation:
    - Validates that an Address instance is correctly created.
    - Confirms correct linkage to the Customer.
    - Checks city and postal code fields.

4. TestCustomerModels.test_comment_creation:
    - Validates that a Comment instance is correctly created.
    - Checks that comment is linked to the correct Customer and Product.
    - Confirms that the default status is 'P' (Pending).

5. TestCustomerModels.test_nested_comment:
    - Validates nested comment functionality (parent/child relationship).
    - Creates a parent comment and a child comment.
    - Asserts that the child comment correctly references the parent.
    - Confirms that the parent's content matches expectations.

General Notes:
- All tests run with database access (`@pytest.mark.django_db`).
- Ensures model relationships, default field values, and data integrity.
- Provides a foundation for testing additional edge cases in Customer, Address, and Comments models.
- Fixtures improve reusability and reduce code duplication across tests.
"""

    @pytest.fixture
    def setup_data(self):
        # کاربر و مشتری
        user = User.objects.create_user(email="customer@example.com", password="password123")
        customer = Customer.objects.create(user=user, username="testuser")
        categroy=Category.objects.create(title='t',description='t',image='t')
        manager_user=User.objects.create_user(email="manger@example.com", password="password123")
        manager=Manager.objects.create(first_name='f',last_name='f',user=manager_user)
        store=Store.objects.create(manager=manager,description='sag',name='sag shop')
        # محصول تستی
        product = Product.objects.create(
            name="Test Product",
            description="Test Description",
            quantity_in_stock=10,
            price=100,
            category=categroy,  # اگر Category NOT NULL است، باید یک نمونه Category بسازید
            store=store     # اگر Store NOT NULL است، باید یک نمونه Store بسازید
        )

        # آدرس
        address = Address.objects.create(
            customer=customer,
            street="123 Test St",
            city="Test City",
            state="Test State",
            postal_code="12345"
        )

        return {
            "user": user,
            "customer": customer,
            "product": product,
            "address": address
        }

    def test_customer_creation(self, setup_data):
        customer = setup_data["customer"]
        assert customer.is_customer is True
        assert customer.username == "testuser"
        assert customer.user.email == "customer@example.com"

    def test_address_creation(self, setup_data):
        address = setup_data["address"]
        assert address.customer.username == "testuser"
        assert address.city == "Test City"
        assert address.postal_code == "12345"

    def test_comment_creation(self, setup_data):
        customer = setup_data["customer"]
        product = setup_data["product"]

        comment = Comments.objects.create(
            descriptions="This is a test comment",
            user=customer,
            product=product
        )

        assert comment.user.username == "testuser"
        assert comment.product.name == "Test Product"
        assert comment.status == "P"  # پیشفرض Pending

    def test_nested_comment(self, setup_data):
        customer = setup_data["customer"]
        product = setup_data["product"]

        parent_comment = Comments.objects.create(
            descriptions="Parent comment",
            user=customer,
            product=product
        )

        child_comment = Comments.objects.create(
            descriptions="Child comment",
            user=customer,
            product=product,
            parent=parent_comment
        )

        assert child_comment.parent == parent_comment
        assert child_comment.parent.descriptions == "Parent comment"
