import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from django.core.files.uploadedfile import SimpleUploadedFile
from vendor.models import Manager, Store, Admin, Operator
from website.models import Product, Category
from account.models import User

@pytest.mark.django_db
class TestVendorAPI:

    @pytest.fixture
    def api_client(self):
        return APIClient()

    @pytest.fixture
    def category(self):
        return Category.objects.create(title="Test Category", description='Test description', image='test.jpg')

    @pytest.fixture
    def manager_user(self):
        return User.objects.create_user(email="manager@test.com", password="12345678")

    @pytest.fixture
    def manager(self, manager_user):
        manager = Manager.objects.create(user=manager_user, first_name="Test", last_name="Manager")
        Store.objects.create(manager=manager, name="Test Store", description="Test store")
        return manager

    @pytest.fixture
    def store(self, manager):
        return Store.objects.get(manager=manager)

    # --------------------- اصلاح تست‌ها ---------------------

    def test_manager_register(self, api_client):
        url = reverse('vendors:api/v1:manager-register')
        data = {
            "user": {
                "email": "newmanager@test.com",
                "password": "12345678",
                "password2": "12345678"
            },
            "first_name": "Alice",
            "last_name": "Smith",
            "store": {
                "name": "New Shop",
                "description": "A new shop"
            },
            "address": {
                "street": "1st Ave",
                "state": "State"
            }
        }
        response = api_client.post(url, data, format='json')
        print(response.data)
        assert response.status_code in [200, 201]

    def test_admin_register(self, api_client, manager):
        api_client.force_authenticate(user=manager.user)
        url = reverse('vendors:api/v1:admin-register')
        data = {
            "username": "admin1",
            "user": {
                "email": "admin@test.com",
                "password": "12345678",
                "password2": "12345678"
            }
        }
        response = api_client.post(url, data, format='json')
        print(response.data)
        assert response.status_code in [200, 201]

    def test_operator_register(self, api_client, manager):
        api_client.force_authenticate(user=manager.user)
        url = reverse('vendors:api/v1:operator-register')
        data = {
            "username": "operator1",
            "user": {
                "email": "operator@test.com",
                "password": "12345678",
                "password2": "12345678"
            }
        }
        response = api_client.post(url, data, format='json')
        print(response.data)
        assert response.status_code in [200, 201]

    def test_add_product(self, api_client, manager, store, category):
        api_client.force_authenticate(user=manager.user)
        url = reverse('vendors:api/v1:add-product')
        data = {
            "name": "Product 1",
            "price": 1000,
            "quantity_in_stock": 10,
            "category": category.id
        }
        response = api_client.post(url, data, format='json')
        print(response.data)
        assert response.status_code in [200, 201]



    def test_product_detail(self, api_client, manager, store, category):
        api_client.force_authenticate(user=manager.user)
        product = Product.objects.create(name="Product 2", price=500, store=store, quantity_in_stock=5, category=category)
        url = reverse('vendors:api/v1:detail-product', args=[product.pk])
        response = api_client.get(url, format='json')
        assert response.status_code == 200
        assert response.data['name'] == "Product 2"

    def test_all_product_shop(self, api_client, manager, store, category):
        api_client.force_authenticate(user=manager.user)
        Product.objects.create(name="Product 3", price=700, store=store, quantity_in_stock=8, category=category)
        url = reverse('vendors:api/v1:all-product-shop')
        response = api_client.get(url, format='json')
        assert response.status_code == 200
        assert len(response.data) >= 1

    def test_add_product_image(self, api_client, manager, store, category):
        api_client.force_authenticate(user=manager.user)
        product = Product.objects.create(name="Product 4", price=800, store=store, quantity_in_stock=12, category=category)
        url = reverse('vendors:api/v1:add-product-image', args=[product.pk])
        image = SimpleUploadedFile("image.jpg", b"fake image content", content_type="image/jpeg")
        response = api_client.post(url, {"image": image}, format='multipart')
        print(response.data)
        assert response.status_code in [200, 201]

    def test_add_product_discount(self, api_client, manager, store, category):
        api_client.force_authenticate(user=manager.user)
        product = Product.objects.create(name="Product 5", price=1000, store=store, quantity_in_stock=10, category=category)
        url = reverse('vendors:api/v1:add-discount-products', args=[product.pk])
        data = {"value": 100, "discount_type": "cash"}
        response = api_client.post(url, data, format='json')
        print(response.data)
        assert response.status_code in [200, 201]


    def test_add_product(self, api_client, manager, store, category):
        api_client.force_authenticate(user=manager.user)
        url = reverse('vendors:api/v1:add-product')
        data = {"name": "Product 1", "price": 1000, "quantity_in_stock": 10, "category": category.id}
        response = api_client.post(url, data, format='json')
        assert response.status_code in [200, 201]

    def test_product_detail(self, api_client, manager, store, category):
        api_client.force_authenticate(user=manager.user)
        product = Product.objects.create(
            name="Product 2",
            price=500,
            store=store,
            quantity_in_stock=5,
            category=category
        )
        url = reverse('vendors:api/v1:detail-product', args=[product.pk])
        response = api_client.get(url, format='json')
        assert response.status_code == 200
        assert response.data['name'] == "Product 2"

    def test_all_product_shop(self, api_client, manager, store, category):
        api_client.force_authenticate(user=manager.user)
        Product.objects.create(
            name="Product 3",
            price=700,
            store=store,
            quantity_in_stock=8,
            category=category
        )
        url = reverse('vendors:api/v1:all-product-shop')
        response = api_client.get(url, format='json')
        assert response.status_code == 200
        assert len(response.data) >= 1

    def test_add_product_image(self, api_client, manager, store, tmp_path, category):
        api_client.force_authenticate(user=manager.user)
        product = Product.objects.create(
            name="Product 4",
            price=800,
            store=store,
            quantity_in_stock=12,
            category=category
        )
        url = reverse('vendors:api/v1:add-product-image', args=[product.pk])
        image_file = tmp_path / "image.jpg"
        image_file.write_bytes(b"fake image content")
        with open(image_file, "rb") as img:
            data = {"image": img}
            response = api_client.post(url, data, format='multipart')
        assert response.status_code in [200, 201]

    def test_add_product_discount(self, api_client, manager, store, category):
        api_client.force_authenticate(user=manager.user)
        product = Product.objects.create(
            name="Product 5",
            price=1000,
            store=store,
            quantity_in_stock=10,
            category=category
        )
        url = reverse('vendors:api/v1:add-discount-products', args=[product.pk])
        data = {"value": 100, "discount_type": "cash"}
        response = api_client.post(url, data, format='json')
        assert response.status_code in [200, 201]

@pytest.mark.django_db
class TestTemplateViews:

    def test_panel_view(self, client):
        url = reverse('vendors:panel')
        response = client.get(url)
        assert response.status_code == 200

    def test_add_product_template(self, client):
        url = reverse('vendors:adding_product')
        response = client.get(url)
        assert response.status_code == 200

    def test_add_admin_template(self, client):
        url = reverse('vendors:adding_admin')
        response = client.get(url)
        assert response.status_code == 200

    def test_product_detail_template(self, client):
        url = reverse('vendors:prodcut-detail')
        response = client.get(url)
        assert response.status_code == 200
