import pytest
from account.models import User
from vendor.models import Manager, Admin, Operator, Store, ShopAddress, ShopRate
from decimal import Decimal
from django.db import models
@pytest.mark.django_db
class TestManagerModel:
    def test_create_manager(self):
        user = User.objects.create_user(email="manager@test.com", password="1234")
        manager = Manager.objects.create(user=user, first_name="John", last_name="Doe")
        assert manager.user.email == "manager@test.com"
        assert manager.first_name == "John"
        assert manager.is_manager is True
        assert str(manager) == user.email


@pytest.mark.django_db
class TestStoreModel:
    def test_create_store_with_manager(self):
        user = User.objects.create_user(email="manager2@test.com", password="1234")
        manager = Manager.objects.create(user=user)
        store = Store.objects.create(manager=manager, name="Test Store", description="A shop")
        assert store.manager == manager
        assert store.name == "Test Store"
        assert store.description == "A shop"
        assert str(store) == f"{store.name}, {store.description}, {manager.user.email}"


@pytest.mark.django_db
class TestAdminModel:
    def test_create_admin_with_shop(self):
        user = User.objects.create_user(email="admin@test.com", password="1234")
        manager_user = User.objects.create_user(email="m2@test.com", password="1234")
        manager = Manager.objects.create(user=manager_user)
        store = Store.objects.create(manager=manager, name="Store2", description="Desc")
        admin = Admin.objects.create(user=user, shop=store, username="admin1")
        assert admin.user.email == "admin@test.com"
        assert admin.shop == store
        assert str(admin) == user.email


@pytest.mark.django_db
class TestOperatorModel:
    def test_create_operator_with_shop(self):
        user = User.objects.create_user(email="operator@test.com", password="1234")
        manager_user = User.objects.create_user(email="m3@test.com", password="1234")
        manager = Manager.objects.create(user=manager_user)
        store = Store.objects.create(manager=manager, name="Store3", description="Desc")
        operator = Operator.objects.create(user=user, shop=store, username="op1")
        assert operator.user.email == "operator@test.com"
        assert operator.shop == store
        assert str(operator) == user.email


@pytest.mark.django_db
class TestShopAddressModel:
    def test_create_shop_address(self):
        user = User.objects.create_user(email="manager4@test.com", password="1234")
        manager = Manager.objects.create(user=user)
        store = Store.objects.create(manager=manager, name="Store4", description="Desc")
        address = ShopAddress.objects.create(store=store, street="Street 1", city="Tehran", state="Tehran State")
        assert address.store == store
        assert address.street == "Street 1"
        assert address.city == "Tehran"
        assert str(address) == "Street 1, Tehran, Tehran State"


@pytest.mark.django_db
class TestShopRateModel:
    def test_shop_rate_total_calculation(self):
        user = User.objects.create_user(email="manager5@test.com", password="1234")
        manager = Manager.objects.create(user=user)
        store = Store.objects.create(manager=manager, name="Store5", description="Desc")

        # ایجاد چند نمره
        ShopRate.objects.create(store=store, rate=3)
        ShopRate.objects.create(store=store, rate=5)

        # همه rateها را بگیریم و total را محاسبه کنیم
        total = ShopRate.objects.filter(store=store).aggregate(total=models.Sum('rate'))['total']
        assert total == 8