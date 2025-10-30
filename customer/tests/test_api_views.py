import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from account.models import User
from customer.models import Customer, Address, Comments
from website.models import Product, Category
from vendor.models import Store, Manager

@pytest.mark.django_db
class TestCustomerAPI:

    @pytest.fixture(autouse=True)
    def setup(self):
        # ایجاد کاربر و مشتری
        self.user = User.objects.create_user(email="testuser@example.com", password="S3cureP@ssw0rd!")
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)
        self.customer = Customer.objects.create(user=self.user, username="TestCustomer")

        # ایجاد Category و Store
        self.category = Category.objects.create(title="Category 1", description="Desc", image="test.png")
        self.manager_user = User.objects.create_user(email="manager@example.com", password="ManagerPass123")
        self.manager = Manager.objects.create(first_name="M", last_name="M", user=self.manager_user)
        self.store = Store.objects.create(manager=self.manager, name="Test Store", description="Store Desc")

        # محصول نمونه
        self.product = Product.objects.create(
            name="Test Product",
            description="Product Desc",
            quantity_in_stock=10,
            price=100,
            category=self.category,
            store=self.store
        )

        # آدرس نمونه
        self.address = Address.objects.create(
            customer=self.customer,
            street="123 Test St",
            city="Test City",
            state="Test State",
            postal_code="12345"
        )

    # --------------------------
    # Customer Register
    # --------------------------
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
        assert response.status_code in [200, 201]
        assert "user" in response.data

    # --------------------------
    # Add Address
    # --------------------------
    def test_add_address(self):
        url = reverse('customer:api/v1:add-address')
        data = {"street": "456 Test St", "city": "CityX", "state": "StateX", "postal_code": "99999"}
        response = self.client.post(url, data, format='json')
        assert response.status_code == 201
        assert response.data['massage'] == "address successfully add"

    # --------------------------
    # Add Comment
    # --------------------------
    def test_add_comment(self):
        url = reverse('customer:api/v1:add-comment', args=[self.product.id])
        data = {"descriptions": "This is a test comment"}
        response = self.client.post(url, data, format='json')
        assert response.status_code == 201
        assert response.data['descriptions'] == "This is a test comment"

    # --------------------------
    # Customer Detail
    # --------------------------
    def test_customer_detail(self):
        url = reverse('customer:api/v1:customer_detail')
        response = self.client.get(url)
        assert response.status_code == 200
        assert response.data['username'] == "TestCustomer"

    # --------------------------
    # Can Rate Product
    # --------------------------
    def test_can_rate_product(self):
        # ابتدا یک OrderItem ایجاد کن تا محصول قابل امتیاز باشد
        from order.models import Order, OrderItem
        order = Order.objects.create(customer=self.customer, status=True)
        OrderItem.objects.create(order=order, product=self.product, quantity=1,)

        url = reverse('customer:api/v1:can-rate', args=[self.product.id])
        response = self.client.get(url)
        assert response.status_code == 200
        assert response.data["can_rate"] is True
