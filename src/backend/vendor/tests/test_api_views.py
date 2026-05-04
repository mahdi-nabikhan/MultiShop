import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from account.models import User
from vendor.models import Manager, Admin, Operator, Store, ShopAddress
from website.models import Category, Product, ProductImages, Discount
from order.models import OrderItem

# ------------------ Fixtures ------------------ #
@pytest.fixture
def api_client():
    return APIClient()

@pytest.fixture
def user_and_store(db):
    
    user = User.objects.create_user(email="manager@test.com", password="1234")
    manager = Manager.objects.create(user=user)

   
    store = Store.objects.create(
        name="Test Store",
        manager=manager,
        description="Nice Store"
    )

    
    ShopAddress.objects.create(
        store=store,
        state="Tehran",
        street="Valiasr"
    )

    
    category = Category.objects.create(title="Electronics", description="Devices")
    product = Product.objects.create(
        name="Test Product",
        description="Test Desc",
        price=1000,
        quantity_in_stock=5,
        store=store,
        category=category
    )

    return user, manager, store, category, product

@pytest.fixture
def product(user_and_store):
    return user_and_store[4]  # همون product موجود

# ------------------ Manager Register ------------------ #
@pytest.mark.django_db
class TestManagerRegisterAPIView:
    def test_register_manager(self, api_client):
        url = '/vendor/api/v1/manager/register/'
        data = {
            "user": {
                "email": "m@test.com",
                "password": "StrongPass123!",
                "password2": "StrongPass123!"
            },
            "store": {
                "name": "My Store",
                "description": "Store Desc",
                "image": None
            },
            "address": {
                "state": "Tehran",
                "street": "Valiasr"
            },
            "first_name": "John",
            "last_name": "Doe"
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert Manager.objects.filter(user__email="m@test.com").exists()

# ------------------ Admin Register ------------------ #
@pytest.mark.django_db
class TestAdminRegisterAPIView:
    def test_register_admin(self, api_client, user_and_store):
        user, _, _, _, _ = user_and_store
        api_client.force_authenticate(user=user)
        url = '/vendor/api/v1/admin/register/'
        data = {
            "username": "admin1",
            "user": {
                "email": "admin@test.com",
                "password": "StrongPass123!",
                "password2": "StrongPass123!"
            }
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert Admin.objects.filter(user__email="admin@test.com").exists()

# ------------------ Operator Register ------------------ #
@pytest.mark.django_db
class TestOperatorRegisterAPIView:
    def test_register_operator(self, api_client, user_and_store):
        user, _, _, _, _ = user_and_store
        api_client.force_authenticate(user=user)
        url = '/vendor/api/v1/operator/register/'
        data = {
            "username": "operator1",
            "user": {
                "email": "op@test.com",
                "password": "StrongPass123!",
                "password2": "StrongPass123!"
            }
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert Operator.objects.filter(user__email="op@test.com").exists()

# ------------------ Add Product ------------------ #
@pytest.mark.django_db
class TestAddProductAPIView:
    def test_create_product(self, api_client, user_and_store):
        user, _, store, category, _ = user_and_store
        api_client.force_authenticate(user=user)
        url = '/vendor/api/v1/add/product/'
        data = {
            "name": "iPhone",
            "description": "Good phone",
            "price": 2000,
            "quantity_in_stock": 5,
            "category": category.id
        }
        response = api_client.post(url, data, format='json')
        assert response.status_code == status.HTTP_201_CREATED
        assert Product.objects.filter(name="iPhone").exists()

# ------------------ Product Detail ------------------ #
@pytest.mark.django_db
class TestProductDetailAPIView:
    def test_get_product_detail(self, api_client, product):
        url = f'/vendor/api/v1/detail/product/{product.pk}/'
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.data["name"] == product.name

# ------------------ All Product Shop ------------------ #
@pytest.mark.django_db
class TestAllProductShopApiView:
    def test_get_all_products(self, api_client, user_and_store, product):
        user, _, _, _, _ = user_and_store
        api_client.force_authenticate(user=user)
        url = '/vendor/api/v1/all/product/shop/'
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert len(response.data) >= 1

# ------------------ Add Product Image ------------------ #
@pytest.mark.django_db
class TestAddProductImageAPIView:
    def test_add_image(self, api_client, user_and_store, product):
        user, _, _, _, _ = user_and_store
        api_client.force_authenticate(user=user)
        url = f'/vendor/api/v1/add/product/image/{product.pk}/'
        image = SimpleUploadedFile(
            name="test_image.jpg",
            content=b"file_content",
            content_type="image/jpeg"
        )
        data = {"product_image": image}
        response = api_client.post(url, data, format='multipart')
        assert response.status_code == status.HTTP_201_CREATED
        assert ProductImages.objects.filter(product=product).exists()

# ------------------ Add Product Discount ------------------ #
@pytest.mark.django_db
class TestAddDiscountAPIView:
    def test_add_discount(self, api_client, user_and_store, product):
        user, _, _, _, _ = user_and_store
        api_client.force_authenticate(user=user)
        url = f'/vendor/api/v1/add/product/discount/{product.pk}/'
        data = {"discount_type": "cash", "value": 200}
        response = api_client.post(url, data, format='json')
        product.refresh_from_db()
        assert response.status_code == status.HTTP_201_CREATED
        assert product.price_after == 800

# ------------------ Update OrderItem ------------------ #
@pytest.mark.django_db
class TestOrderItemUpdateStatusApiView:
    def test_update_status(self, api_client, user_and_store, product):
        user, _, _, _, _ = user_and_store
        # مقدار quantity را حتما مشخص می‌کنیم
        order_item = OrderItem.objects.create(product=product, quantity=1, status="pending")
        api_client.force_authenticate(user=user)
        url = f'/vendor/api/v1/update/orderitem/{order_item.pk}/'
        data = {"status": "sent"}
        response = api_client.patch(url, data, format='json')
        order_item.refresh_from_db()
        assert response.status_code == status.HTTP_200_OK
        assert order_item.status == "sent"
