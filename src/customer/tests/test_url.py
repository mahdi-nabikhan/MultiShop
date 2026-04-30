import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from account.models import User
from customer.models import Customer, Address, Comments
from website.models import *
from vendor.models import *

@pytest.mark.django_db
class TestCustomerAPI:

    @pytest.fixture(autouse=True)
    def setup(self):
        # کاربر تستی بساز
        self.user = User.objects.create_user(email="testuser@example.com", password="S3cureP@ssw0rd!")
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.customer = Customer.objects.create(user=self.user, username="TestCustomer")
        self.categroy=Category.objects.create(title='t',description='t',image='t')
        self.manager_user=User.objects.create_user(email="manger@example.com", password="password123")
        self.manager=Manager.objects.create(first_name='f',last_name='f',user=self.manager_user)
        self.store=Store.objects.create(manager=self.manager,description='sag',name='sag shop')
        # محصول تستی
        self.product = Product.objects.create(
            name="Test Product",
            description="Test Description",
            quantity_in_stock=10,
            price=100,
            category=self.categroy,  # اگر Category NOT NULL است، باید یک نمونه Category بسازید
            store=self.store     # اگر Store NOT NULL است، باید یک نمونه Store بسازید
        )
        address = Address.objects.create(
            customer=self.customer,
            street="123 Test St",
            city="Test City",
            state="Test State",
            postal_code="12345"
        )
    def test_customer_register_endpoint(self):
        url = reverse('customer:api/v1:customer-register')
        data = {
            "username": "newcustomer",
            "user": {
                "email": "newuser@example.com",
                "password": "S3cureP@ssw0rd!",
                "password2": "S3cureP@ssw0rd!"
            }
        }
        response = self.client.post(url, data, format='json')
        assert response.status_code == 200 or response.status_code == 201

    def test_add_address(self):
        url = reverse('customer:api/v1:add-address')
        data = {"street":"Test St","city":"Test City","state":"Test State","postal_code":"12345"}
        response = self.client.post(url, data, format='json')
        assert response.status_code == 201
        assert response.data['city'] == "Test City"

    def test_add_comment(self):
        url = reverse('customer:api/v1:add-comment', args=[self.product.id])
        data = {"descriptions":"This is a test comment"}
        response = self.client.post(url, data, format='json')
        assert response.status_code == 201
        assert response.data['descriptions'] == "This is a test comment"

    def test_customer_detail(self):
        url = reverse('customer:api/v1:customer_detail')
        response = self.client.get(url)
        assert response.status_code == 200
        assert response.data['username'] == "TestCustomer"

    def test_can_rate_product(self):
        url = reverse('customer:api/v1:can-rate', args=[self.product.id])
        response = self.client.get(url)
        assert response.status_code == 200
