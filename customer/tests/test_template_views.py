import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from account.models import User
from customer.models import Customer

@pytest.mark.django_db
class TestCustomerTemplateViews:

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
