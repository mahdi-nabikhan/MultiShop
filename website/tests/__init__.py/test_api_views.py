# website/tests/api/base.py
import pytest
from django.urls import reverse
from website.models import *
from vendor.models import *
from account.models import *


@pytest.mark.django_db
class BaseAPITest:
    endpoint_random = reverse('webste_api_v1:random-products')

    endpoint_filter = reverse('webste_api_v1:product_filter')

    def setup_method(self):
        user=User.objects.create(email='testmanager@gmail.com',password='mmd12345')
        manager=Manager.objects.create(user=user,first_name='test',last_name='this is')
        self.store=Store.objects.create(manager=manager,name="Test Store",description='this is test store')
        self.category= Category.objects.create(
        title="Electronics",
        description="Test description",
        image="test.jpg"
    )
        # چند محصول بسازیم برای تست
        self.product1 = Product.objects.create(
            name="Product 1",
            description="Desc",
            quantity_in_stock=10,
            price=300,
            store=self.store,
            category=self.category
        )
        self.product2 = Product.objects.create(
            name="Product 2",
            description="Desc",
            quantity_in_stock=10,
            price=100,
            store=self.store,
            category=self.category
        )


# website/tests/api/test_api_views.py
import pytest
from django.urls import reverse
from website.models import Product
from vendor.models import Store

@pytest.mark.django_db
class TestRandomProductsAPI:

    def setup_method(self):
        self.endpoint_random = reverse('webste_api_v1:random-products')
        user=User.objects.create(email='testmanager@gmail.com',password='mmd12345')
        manager=Manager.objects.create(user=user,first_name='test',last_name='this is')
        self.store=Store.objects.create(manager=manager,name="Test Store",description='this is test store')
        self.category= Category.objects.create(
        title="Electronics",
        description="Test description",
        image="test.jpg"
        )   
        for i in range(6):
            Product.objects.create(
                name=f"Product {i}",
                description="Desc",
                quantity_in_stock=10,
                price=100 + i,
                store=self.store,
                category=self.category,
            )

    def test_random_products_status_code(self, client):
        response = client.get(self.endpoint_random)
        assert response.status_code == 200

    def test_random_products_limit(self, client):
        response = client.get(self.endpoint_random)
        assert isinstance(response.data, list)
        assert len(response.data) <= 5

    def test_random_products_cache(self, client, cache):
        response1 = client.get(self.endpoint_random)
        response2 = client.get(self.endpoint_random)

        assert response1.data == response2.data  # چون cache شده


