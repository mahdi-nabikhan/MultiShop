import pytest
from website.models import Category, Product, Discount, ProductRate
from vendor.models import *
from account.models import *

@pytest.fixture
def store():
    """
    Pytest fixture that creates and returns a test Store instance.

    Responsibilities
    ----------------
    - Create a test user with email 'testmanager@gmail.com' and password 'mmd12345'.
    - Create a Manager associated with that user (first_name='test', last_name='this is').
    - Create and return a Store owned by the manager with name "Test Store" and description 'this is test store'.

    Returns
    -------
    Store
        A Django Store model instance ready for use in tests.

    Usage
    -----
        def test_something(store):
            assert store.name == "Test Store"

    Notes
    -----
    - This fixture does not require database setup manually; it uses pytest's dependency injection.
    - The created user and manager exist in the test database but are not returned directly.
    """
    user=User.objects.create(email='testmanager@gmail.com',password='mmd12345')
    manager=Manager.objects.create(user=user,first_name='test',last_name='this is')
    return Store.objects.create(manager=manager,name="Test Store",description='this is test store')


@pytest.fixture
def category():
    """
    Pytest fixture that creates and returns a test Category instance.

    Responsibilities
    ----------------
    - Create a Category with title "Electronics", description "Test description", and image "test.jpg".
    - Return the created Category object.

    Returns
    -------
    Category
        A Django Category model instance.

    Usage
    -----
        def test_category_name(category):
            assert category.title == "Electronics"

    Notes
    -----
    - The category is independent and can be used with other fixtures.
    """
    return Category.objects.create(
        title="Electronics",
        description="Test description",
        image="test.jpg"
    )


@pytest.fixture
def product(category, store):
    """
    Pytest fixture that creates and returns a test Product instance.

    Responsibilities
    ----------------
    - Accept `category` and `store` fixtures as dependencies.
    - Create a Product named "Laptop" with description "Gaming Laptop",
      quantity_in_stock=10, price=1000, linked to the provided category and store.
    - Return the created Product object.

    Args
    ----
    category : Category
        Fixture providing a Category instance.
    store : Store
        Fixture providing a Store instance.

    Returns
    -------
    Product
        A Django Product model instance ready for tests.

    Usage
    -----
        def test_product_price(product):
            assert product.price == 1000

    Notes
    -----
    - Relies on `category` and `store` fixtures; ensure they are defined in the test context.
    """
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
    """
    Test suite for the Discount model and its `apply_discount` method.

    Responsibilities
    ----------------
    - Test cash discount application: subtracts fixed value from price.
    - Test percentage discount application: subtracts percentage of price.
    - Test string representation of Discount instance.

    Methods
    -------
    test_apply_cash_discount(self, product)
        - Creates a cash discount of 200 on a product priced 1000.
        - Asserts that apply_discount returns 800.
    test_apply_percentage_discount(self, product)
        - Creates a percentage discount of 10% on a product priced 1000.
        - Asserts that apply_discount returns 900.
    test_str_representation(self, product)
        - Creates a cash discount of value 50.
        - Asserts that str(discount) equals "cash: 50".

    Usage
    -----
        # Run the tests with pytest
        pytest website/tests/test_models.py

    Notes
    -----
    - Each test method is marked with `@pytest.mark.django_db` to allow database access.
    - The `product` fixture provides a test Product instance.
    - The Discount model should have a field `products` (presumably ManyToMany or ForeignKey).
    """

    @pytest.mark.django_db
    def test_apply_cash_discount(self, product):
        """
        Test that a cash discount correctly subtracts the value from the original price.

        Responsibilities
        ----------------
        - Create a Discount with discount_type='cash', value=200, linked to the product.
        - Call apply_discount(1000) and assert the result is 800.

        Args:
            product : Fixture providing a Product instance with price 1000.

        Returns:
            None; raises assertion error if discount calculation is incorrect.
        """
        discount = Discount.objects.create(discount_type='cash', value=200, products=product)
        assert discount.apply_discount(1000) == 800

    @pytest.mark.django_db
    def test_apply_percentage_discount(self, product):
        """
        Test that a percentage discount correctly subtracts the percentage from the original price.

        Responsibilities
        ----------------
        - Create a Discount with discount_type='percentage', value=10, linked to the product.
        - Call apply_discount(1000) and assert the result is 900.

        Args:
            product : Fixture providing a Product instance with price 1000.

        Returns:
            None; raises assertion error if discount calculation is incorrect.
        """
        discount = Discount.objects.create(discount_type='percentage', value=10, products=product)
        assert discount.apply_discount(1000) == 900

    @pytest.mark.django_db
    def test_str_representation(self, product):
        """
        Test the string representation of a Discount instance.

        Responsibilities
        ----------------
        - Create a Discount with discount_type='cash', value=50.
        - Assert that str(discount) returns the formatted string "cash: 50".

        Args:
            product : Fixture providing a Product instance (required for discount creation).

        Returns:
            None; raises assertion error if __str__ method is not implemented correctly.
        """
        discount = Discount.objects.create(discount_type='cash', value=50, products=product)
        assert str(discount) == "cash: 50"


class TestProductRateModel:
    """
    Test suite for the ProductRate model and its rate calculation methods.

    Responsibilities
    ----------------
    - Test total rate calculation: sum of all rates for a product.
    - Test string representation of ProductRate instance.

    Methods
    -------
    test_total_rate_calculation(self, product)
        - Creates three ProductRate objects for the same product with rates 3, 2, 5.
        - Calls `get_total_rate()` on the last created object.
        - Asserts that the total sum equals 10.
    test_str_representation(self, product)
        - Creates a ProductRate with rate=4.
        - Asserts that str(rate_obj) equals f"{product} 4".

    Usage
    -----
        # Run the tests with pytest
        pytest website/tests/test_models.py

    Notes
    -----
    - Each test method uses `@pytest.mark.django_db`.
    - The `product` fixture provides a Product instance.
    - The method `get_total_rate()` is assumed to aggregate rates across all ProductRate rows for that product.
    """
    @pytest.mark.django_db
    def test_total_rate_calculation(self, product):
        """
        Test that `get_total_rate` returns the sum of all rates for a given product.

        Responsibilities
        ----------------
        - Create three ProductRate records for the same product with rates 3, 2, and 5.
        - Call `get_total_rate()` on the last created ProductRate instance.
        - Assert that the returned total is 10.

        Args:
            product : Fixture providing a Product instance.

        Returns:
            None; raises assertion error if total sum is not 10.
        """
        ProductRate.objects.create(product=product, rate=3)
        ProductRate.objects.create(product=product, rate=2)
        rate_obj = ProductRate.objects.create(product=product, rate=5)
        assert rate_obj.get_total_rate() == 10
    
    @pytest.mark.django_db
    def test_str_representation(self, product):
        """
        Test the string representation of a ProductRate instance.

        Responsibilities
        ----------------
        - Create a ProductRate with rate=4.
        - Assert that str(rate_obj) equals f"{product} 4" (e.g., "Laptop 4").

        Args:
            product : Fixture providing a Product instance.

        Returns:
            None; raises assertion error if __str__ method is missing or incorrect.
        """
        rate_obj = ProductRate.objects.create(product=product, rate=4)
        assert str(rate_obj) == f"{product} 4"
