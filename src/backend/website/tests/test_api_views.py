# website/tests/api/base.py
import pytest
from django.urls import reverse
from website.models import *
from vendor.models import *
from account.models import *




@pytest.mark.django_db
class BaseAPITest:
    """
    Base test class providing common setup and endpoints for API tests.

    Responsibilities
    ----------------
    - Define reusable endpoints for random-products and product-filter APIs.
    - Create a test store, category, and two sample products for use in derived test classes.
    - Uses `setup_method` to initialize test data before each test.

    Attributes
    ----------
    endpoint_random : str
        - Reverse URL for 'webste_api_v1:random-products' endpoint.
    endpoint_filter : str
        - Reverse URL for 'webste_api_v1:product_filter' endpoint.
    store : Store
        - A test store instance linked to a manager.
    category : Category
        - A test category instance.
    product1 : Product
        - First product with price 300.
    product2 : Product
        - Second product with price 100.

    Methods
    -------
    setup_method(self)
        - Creates a test user, manager, store, category, and two products.
        - Called automatically before each test method.

    Usage
    -----
        # Inherit from this class in specific test classes
        class TestMyAPI(BaseAPITest):
            def test_something(self, client):
                response = client.get(self.endpoint_random)
                assert response.status_code == 200

    Notes
    -----
    - Requires pytest and Django's database access (`pytest.mark.django_db`).
    - The `setup_method` is executed for every test in derived classes.
    - Uses `User`, `Manager`, `Store`, `Category`, `Product` models.
    """
    endpoint_random = reverse('webste_api_v1:random-products')

    endpoint_filter = reverse('webste_api_v1:product_filter')

    def setup_method(self):
        """
        Set up test data before each test method.

        Responsibilities
        ----------------
        - Create a test user with email 'testmanager@gmail.com' and password 'mmd12345'.
        - Create a Manager associated with that user.
        - Create a test store owned by the manager.
        - Create a test category (Electronics).
        - Create two products (Product 1 price 300, Product 2 price 100) linked to store and category.

        Notes
        -----
        - This method is automatically called by pytest for each test in the class.
        - The created objects are stored as instance attributes (self.store, self.category, self.product1, self.product2).
        """
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



@pytest.mark.django_db
class TestRandomProductsAPI:
    """
    Test suite for the RandomProductsApiView.

    Responsibilities
    ----------------
    - Verify that the random products endpoint returns HTTP 200.
    - Ensure the response data is a list with a maximum length of 5 items.
    - Confirm that caching works: two identical GET requests return the same data.

    Attributes
    ----------
    endpoint_random : str
        - Reverse URL for the random-products endpoint.

    Methods
    -------
    setup_method(self)
        - Creates test user, manager, store, category, and 6 products (0..5) before each test.
    test_random_products_status_code(self, client)
        - Sends GET request to endpoint and asserts status code 200.
    test_random_products_limit(self, client)
        - Asserts response is a list and its length ≤ 5.
    test_random_products_cache(self, client, cache)
        - Makes two consecutive GET requests and asserts they return identical data due to caching.

    Usage
    -----
        # Run these tests with pytest:
        pytest website/tests/api/test_api_views.py

    Notes
    -----
    - The `cache` fixture is provided by pytest-django (or django-cache)
      and ensures a clean cache for the test.
    - Products are created with prices 100 to 105 (since i from 0 to 5: price = 100 + i).
    - The endpoint should return at most 5 random products from the 6 created.
    - The cache test relies on the 5-minute timeout; the test assumes cache is enabled.
    """


    def setup_method(self):
        """
        Set up test data before each test method.

        Responsibilities
        ----------------
        - Create a test user, manager, store, and a category.
        - Create 6 products (named Product 0 to Product 5) with increasing prices (100 to 105).
        - Store the endpoint reverse URL in `self.endpoint_random`.

        Notes
        -----
        - Called automatically before each test.
        - This setup ensures a consistent database state for each test.
        """
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
        """
        Test that the random products endpoint returns HTTP 200 OK.

        Responsibilities
        ----------------
        - Send a GET request to the endpoint.
        - Assert that the response status code is 200.

        Args:
            client : Django test client fixture.

        Returns:
            None; raises assertion error if status code is not 200.
        """
        response = client.get(self.endpoint_random)
        assert response.status_code == 200

    def test_random_products_limit(self, client):
        """
        Test that the response contains at most 5 products.

        Responsibilities
        ----------------
        - Send GET request to the endpoint.
        - Verify that `response.data` is a list.
        - Verify that the length of the list is less than or equal to 5.

        Args:
            client : Django test client fixture.

        Returns:
            None; raises assertion error if response is not a list or length > 5.
        """
        response = client.get(self.endpoint_random)
        assert isinstance(response.data, list)
        assert len(response.data) <= 5

    def test_random_products_cache(self, client, cache):
        """
        Test that the endpoint uses caching and returns identical data for successive requests.

        Responsibilities
        ----------------
        - Send two consecutive GET requests to the endpoint.
        - Assert that the data from both responses are identical.
        - This confirms that the second request hits the cache instead of generating new random data.

        Args:
            client : Django test client fixture.
            cache : Django cache fixture (clears cache before test).

        Returns:
            None; raises assertion error if data differs.
        """
        response1 = client.get(self.endpoint_random)
        response2 = client.get(self.endpoint_random)

        assert response1.data == response2.data  # چون cache شده


