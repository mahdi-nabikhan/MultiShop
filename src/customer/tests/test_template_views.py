import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from account.models import User
from customer.models import Customer

@pytest.mark.django_db
class TestCustomerTemplateViews:
    """
Test suite for Customer-related TemplateViews.

This module contains tests to validate that the Django TemplateViews for
the Customer app are correctly rendering the expected templates and
returning HTTP 200 responses for authenticated users.

Setup
-----
The `setup` fixture automatically runs before each test:
    - Creates a test User and associated Customer.
    - Authenticates the APIClient with the test user.

Tests
-----
1. test_customer_register_template_view:
    - Tests the customer registration template view.
    - Sends a GET request to the registration URL.
    - Asserts HTTP 200 OK status.
    - Confirms that the rendered template is 'accounts/costomer_register.html'.

2. test_customer_profile_template_view:
    - Tests the profile page template view for the authenticated customer.
    - Sends a GET request to the profile URL.
    - Asserts HTTP 200 OK status.
    - Confirms that the rendered template is 'customer/profile.html'.

3. test_address_detail_template_view:
    - Tests the address detail template view.
    - Sends a GET request to the address detail URL.
    - Asserts HTTP 200 OK status.
    - Confirms that the rendered template is 'customer/address_detail.html'.

4. test_comment_detail_template_view:
    - Tests the comment detail template view.
    - Sends a GET request to the comments detail URL.
    - Asserts HTTP 200 OK status.
    - Confirms that the rendered template is 'customer/comments_detail.html'.

5. test_order_item_template_view:
    - Tests the order item detail template view.
    - Sends a GET request to the order item detail URL.
    - Asserts HTTP 200 OK status.
    - Confirms that the rendered template is 'customer/order_detail.html'.

General Notes
-------------
- All tests use `@pytest.mark.django_db` for database access.
- APIClient is force-authenticated to simulate a logged-in user.
- Template existence and correct rendering are validated via the `response.templates` list.
- These tests ensure that the correct template is used for each URL and help prevent
  template misconfigurations in the Customer app.
"""


    @pytest.fixture(autouse=True)
    def setup(self):
        # کاربر و مشتری تستی بساز
        self.user = User.objects.create_user(email="testuser@example.com", password="S3cureP@ssw0rd!")
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.customer = Customer.objects.create(user=self.user, username="TestCustomer")

    def test_customer_register_template_view(self):
        url=reverse('customer:register')
        response = self.client.get(url)
        assert response.status_code == 200
        assert 'accounts/costomer_register.html' in [t.name for t in response.templates]

    def test_customer_profile_template_view(self):
        url = reverse('customer:profile')
        response = self.client.get(url)
        assert response.status_code == 200
        assert 'customer/profile.html' in [t.name for t in response.templates]

    def test_address_detail_template_view(self):
        url = reverse('customer:address_detail')
        response = self.client.get(url)
        assert response.status_code == 200
        assert 'customer/address_detail.html' in [t.name for t in response.templates]

    def test_comment_detail_template_view(self):
        url = reverse('customer:comments-detail')
        response = self.client.get(url)
        assert response.status_code == 200
        assert 'customer/comments_detail.html' in [t.name for t in response.templates]

    def test_order_item_template_view(self):
        url = reverse('customer:order-item-detail')
        response = self.client.get(url)
        assert response.status_code == 200
        assert 'customer/order_detail.html' in [t.name for t in response.templates]
