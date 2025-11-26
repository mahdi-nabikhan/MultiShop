import pytest
from website.models import Category, Product, Discount, ProductRate
from vendor.models import *
from account.models import *

@pytest.fixture
def store():
    user=User.objects.create(email='testmanager@gmail.com',password='mmd12345')
    manager=Manager.objects.create(user=user,first_name='test',last_name='this is')
    return Store.objects.create(manager=manager,name="Test Store",description='this is test store')


@pytest.fixture
def category():
    return Category.objects.create(
        title="Electronics",
        description="Test description",
        image="test.jpg"
    )


@pytest.fixture
def product(category, store):
    return Product.objects.create(
        name="Laptop",
        description="Gaming Laptop",
        quantity_in_stock=10,
        price=1000,
        category=category,
        store=store
    )
import pytest
from website.models import Discount, ProductRate


class TestDiscountModel:
    @pytest.mark.django_db
    def test_apply_cash_discount(self, product):
        discount = Discount.objects.create(discount_type='cash', value=200, products=product)
        assert discount.apply_discount(1000) == 800

    @pytest.mark.django_db
    def test_apply_percentage_discount(self, product):
        discount = Discount.objects.create(discount_type='percentage', value=10, products=product)
        assert discount.apply_discount(1000) == 900

    @pytest.mark.django_db
    def test_str_representation(self, product):
        discount = Discount.objects.create(discount_type='cash', value=50, products=product)
        assert str(discount) == "cash: 50"


class TestProductRateModel:
    @pytest.mark.django_db
    def test_total_rate_calculation(self, product):
        ProductRate.objects.create(product=product, rate=3)
        ProductRate.objects.create(product=product, rate=2)
        rate_obj = ProductRate.objects.create(product=product, rate=5)
        assert rate_obj.get_total_rate() == 10
    
    @pytest.mark.django_db
    def test_str_representation(self, product):
        rate_obj = ProductRate.objects.create(product=product, rate=4)
        assert str(rate_obj) == f"{product} 4"
