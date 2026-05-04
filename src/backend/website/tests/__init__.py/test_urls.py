# website/tests/test_urls.py
import pytest
from django.urls import reverse, resolve
from vendor.models import User, Manager, Store


@pytest.mark.django_db
class TestWebsiteURLs:
    """
    Test suite for URL resolution and HTTP responses of website endpoints.

    Responsibilities
    ----------------
    - Verify that named URLs resolve to the correct view names.
    - Test that shop list, shop detail, product list, and product detail endpoints return expected HTTP status codes.
    - Use parameterized testing for URL resolution to reduce code duplication.
    - Create necessary database objects (store, manager, user) when required for testing.

    Methods
    -------
    test_urls_resolve(self, url_name, kwargs)
        - Parameterized test to check URL reverse+resolve for multiple endpoints.
    test_shop_list_view(self, client)
        - Sends GET request to 'shop-list' URL and asserts status code is 200 or 204.
    test_shop_detail_view(self, client)
        - Sends GET request to 'shop-detail' with pk=1; expects 200 (if exists) or 404.
    test_product_detail_view(self, client)
        - Sends GET request to 'product-detail' with pk=1; expects 200 or 404.
    test_product_list_view(self, client)
        - Creates a store and sends GET request to 'product-list' with store.pk; expects 200 or 204.

    Usage
    -----
        # Run all URL tests
        pytest website/tests/test_urls.py

    Notes
    -----
    - All tests are marked with `pytest.mark.django_db` at class level to allow database access.
    - The `test_product_list_view` requires creating a store because the URL pattern uses a primary key.
    - The `test_urls_resolve` method uses `@pytest.mark.parametrize` to test four different endpoints.
    """
    
    @pytest.mark.parametrize("url_name, kwargs", [
        ('shop-list', None),
        ('product-list', {'pk': 1}),
        ('shop-detail', {'pk': 1}),
        ('product-detail', {'pk': 1}),
    ])
    def test_urls_resolve(self, url_name, kwargs):
        """
        Test that URL names reverse and resolve correctly.

        Responsibilities
        ----------------
        - Use `reverse()` to generate a URL from a view name and optional keyword arguments.
        - Use `resolve()` to get the view name from the generated URL.
        - Assert that the resolved view name matches the original URL name.

        Args:
            url_name (str): The name of the URL pattern (e.g., 'shop-list').
            kwargs (dict or None): Keyword arguments for URL reversal (e.g., {'pk': 1}).

        Returns:
            None; raises assertion error if resolution fails or view name differs.

        Notes
        -----
        - This test does not require database objects because it only checks URL routing.
        - The parameter `kwargs` is set to `{'pk': 1}` for detail/list endpoints; existence of object with pk=1 is not required for resolution.
        """
        """ بررسی اینکه URL ها درست resolve میشن """
        if kwargs:
            url = reverse(url_name, kwargs=kwargs)
        else:
            url = reverse(url_name)

        assert resolve(url).view_name == url_name

    def test_shop_list_view(self, client):
        """
        Test the HTTP response of the shop-list endpoint.

        Responsibilities
        ----------------
        - Reverse the 'shop-list' URL.
        - Send a GET request using the test client.
        - Assert that the response status code is either 200 OK or 204 No Content.

        Args:
            client : Django test client fixture.

        Returns:
            None; raises assertion error if status code is not 200 or 204.

        Notes
        -----
        - The expected status depends on the view implementation. 200 if there are shops, 204 if empty.
        - No database objects are created in this test.
        """
        url = reverse('shop-list')
        response = client.get(url)
        assert response.status_code in [200, 204]  

    def test_shop_detail_view(self, client):
        """
        Test the HTTP response of the shop-detail endpoint with a specific primary key.

        Responsibilities
        ----------------
        - Reverse the 'shop-detail' URL with kwargs {'pk': 1}.
        - Send a GET request.
        - Assert that the response status code is 200 (if object exists) or 404 (if not found).

        Args:
            client : Django test client fixture.

        Returns:
            None; raises assertion error if status code is neither 200 nor 404.

        Notes
        -----
        - No store is created; therefore, a 404 is expected unless a store with pk=1 already exists in the test database.
        """
        url = reverse('shop-detail', kwargs={'pk': 1})
        response = client.get(url)
        assert response.status_code in [200, 404]

    def test_product_detail_view(self, client):
        """
        Test the HTTP response of the product-detail endpoint with a specific primary key.

        Responsibilities
        ----------------
        - Reverse the 'product-detail' URL with kwargs {'pk': 1}.
        - Send a GET request.
        - Assert that the response status code is 200 (if object exists) or 404 (if not found).

        Args:
            client : Django test client fixture.

        Returns:
            None; raises assertion error if status code is neither 200 nor 404.

        Notes
        -----
        - No product is created; therefore, a 404 is expected unless a product with pk=1 already exists.
        """
        url = reverse('product-detail', kwargs={'pk': 1})
        response = client.get(url)
        assert response.status_code in [200, 404]


    # تستی که نیاز به Store داره:
    def test_product_list_view(self, client):
        """
        Test the HTTP response of the product-list endpoint with a valid store primary key.

        Responsibilities
        ----------------
        - Create a test user, manager, and a store.
        - Reverse the 'product-list' URL using the store's primary key.
        - Send a GET request to that URL.
        - Assert that the response status code is 200 or 204.

        Args:
            client : Django test client fixture.

        Returns:
            None; raises assertion error if status code is not 200 or 204.

        Notes
        -----
        - This test creates a store to ensure the URL resolves with an existing primary key.
        - The expected status code depends on the view: 200 OK for a successful response, or 204 No Content if there are no products.
        """
        user = User.objects.create(email='testmanager@gmail.com', password='mmd12345')
        manager = Manager.objects.create(user=user, first_name='test', last_name='this is')
        store = Store.objects.create(manager=manager, name="Test Store", description='this is test store')

        url = reverse('product-list', kwargs={'pk': store.pk})
        response = client.get(url)

        assert response.status_code in [200, 204]  # بسته به view تو
