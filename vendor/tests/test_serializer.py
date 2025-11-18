import pytest
from rest_framework.test import APIRequestFactory
from website.models import Category, Product, ProductImages, Discount
from order.models import *
from account.models import *
from vendor.models import *
from vendor.api.v1.serializers import (
    ProductSerializer,
    AddImageSerializer,
    AddDiscountSerializer,
    OrderItemUpdateStatusSerializer
)

@pytest.fixture
@pytest.mark.django_db
def category():
    return Category.objects.create(title="Electronics", description="Devices")

@pytest.fixture
@pytest.mark.django_db
def manager_and_store(category):
    user = User.objects.create_user(email="manager@test.com", password="1234")
    manager = Manager.objects.create(user=user)
    store = manager.store = Store.objects.create(manager=manager, name="Test Store", description="Desc")
    return manager, store, user

@pytest.fixture
@pytest.mark.django_db
def product(manager_and_store, category):
    manager, store, user = manager_and_store
    return Product.objects.create(
        name="Test Product",
        description="Test Desc",
        price=1000,
        quantity_in_stock=5,
        store=store,
        category=category
    )

@pytest.mark.django_db
class TestProductSerializer:
    def test_create_product_manager(self, manager_and_store, category):
        manager, store, user = manager_and_store
        factory = APIRequestFactory()
        request = factory.post("/fake-url/")
        request.user = user

        data = {
            "name": "Phone",
            "description": "Good phone",
            "price": 2000,
            "quantity_in_stock": 3,
            "category": category.id
        }
        serializer = ProductSerializer(data=data, context={"request": request})
        assert serializer.is_valid(raise_exception=True)
        product = serializer.save()
        assert product.name == "Phone"
        assert product.category == category
        assert product.store == store

@pytest.mark.django_db
class TestAddImageSerializer:
    def test_create_image(self, product):
        data = {"product_image": None}  # فرض کنیم تصویر نیست
        serializer = AddImageSerializer(data=data, context={"pk": product.pk})
        instance = serializer.create({"product_image": None, "product": product})
        assert instance.product == product

@pytest.mark.django_db
class TestAddDiscountSerializer:
    def test_cash_discount(self, product):
        serializer = AddDiscountSerializer(data={"value": 200, "discount_type": "cash"}, context={"pk": product.pk})
        assert serializer.is_valid()
        serializer.create({"value": 200, "discount_type": "cash"})
        product.refresh_from_db()
        assert product.price_after == 800

    # def test_percentage_discount(self, product):
    #     serializer = AddDiscountSerializer(data={"value": 10, "discount_type": "percentage"}, context={"pk": product.pk})
    #     assert serializer.is_valid()
    #     serializer.create({"value": 10, "discount_type": "percentage"})
    #     product.refresh_from_db()
    #     assert product.price_after == 900


@pytest.mark.django_db
class TestOrderItemUpdateStatusSerializer:

    @pytest.fixture
    def user(self, django_user_model):
        return django_user_model.objects.create_user(email="customer@test.com", password="1234")

    @pytest.fixture
    def product(self, manager_and_store):
        manager, store, _ = manager_and_store
        from website.models import Category
        category = Category.objects.create(title="Test Category",description='thygh',image='hfhsdj.jpg')
        return Product.objects.create(
            name="Test Product",
            description="Test Desc",
            price=1000,
            quantity_in_stock=5,
            store=store,
            category=category
        )

    @pytest.fixture
    def order(self, user):
        from order.models import Order
        customer=Customer.objects.create(user=user,username='jfhnj')
        return Order.objects.create(customer=customer)

    @pytest.fixture
    def order_item(self, product, order):
        return OrderItem.objects.create(product=product, order=order, quantity=2, status="P")

    def test_update_status(self, order_item):
        serializer = OrderItemUpdateStatusSerializer(order_item, data={"status": "C"}, partial=True)
        assert serializer.is_valid(raise_exception=True)
        updated_item = serializer.save()
        assert updated_item.status == "C"
        assert updated_item.product == order_item.product
