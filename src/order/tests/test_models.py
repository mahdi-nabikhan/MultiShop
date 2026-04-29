import pytest
from decimal import Decimal
from django.utils import timezone
from customer.models import Customer, Address
from website.models import Product, Store, Category
from order.models import Order, OrderItem, Bill
from account.models import User
from vendor.models import Manager

@pytest.mark.django_db
class TestOrderModels:
    """
    Test suite for Order, OrderItem, and Bill models.

    This suite covers:

    1. Order model:
       - Creation of an Order instance.
       - Default fields (status, created date) are correctly set.
       - __str__ representation.

    2. OrderItem model:
       - Creation of OrderItem and automatic calculation of total price.
       - get_total_price() method correctness.
       - Saving an OrderItem updates total and status.

    3. Bill model:
       - Creation of a Bill linked to an Order and Customer address.
       - Default status field correctness.
       - __str__ representation.

    Notes:
    ------
    - All tests rely on fixture 'sample_data' which provides a Customer, Product, and Address.
    - Monetary fields are tested using Decimal for precision.
    - Tests ensure the relationships between models (Order -> Customer, OrderItem -> Product, Bill -> Order) are correctly maintained.
    """

    @pytest.fixture
    def sample_data(self):
        # ایجاد کاربران
        user = User.objects.create_user(email='test@gmail.com', password='pass12345')
        manager_user = User.objects.create_user(email='test1@gmail.com', password='pass12345')

        # ایجاد مدیر و مشتری
        manager = Manager.objects.create(user=manager_user, first_name='a', last_name='a')
        customer = Customer.objects.create(user=user, username="mahdi")

        # دسته‌بندی، فروشگاه و محصول
        category = Category.objects.create(title="Electronics", image="cat.png", description="Electronics category")
        store = Store.objects.create(name="Tech Store", description="Tech gadgets", manager=manager)

        product = Product.objects.create(
            name="Laptop",
            description="Powerful laptop",
            price=Decimal("1500.00"),
            store=store,
            category=category,
            quantity_in_stock=5
        )

        # آدرس مشتری
        address = Address.objects.create(
            customer=customer,
            street="Main St",
            city="Tehran",
            state="Tehran",
            postal_code="12345",
        )

        return {"customer": customer, "product": product, "address": address}

    def test_create_order(self, sample_data):
        customer = sample_data["customer"]
        order = Order.objects.create(customer=customer)

        assert isinstance(order, Order)
        assert order.customer.username == "mahdi"
        assert order.status is False
        assert order.created.date() == timezone.now().date()

    def test_create_order_item_and_total(self, sample_data):
        customer = sample_data["customer"]
        product = sample_data["product"]

        order = Order.objects.create(customer=customer)
        item = OrderItem.objects.create(order=order, product=product, quantity=2)
        item.refresh_from_db()

        assert item.get_total_price() == Decimal("3000.00")
        assert item.total == Decimal("3000.00")
        assert str(item) == f"{product.name},2"

    def test_order_item_save_calculates_total(self, sample_data):
        customer = sample_data["customer"]
        product = sample_data["product"]
        order = Order.objects.create(customer=customer)

        item = OrderItem(order=order, product=product, quantity=3)
        item.save()

        assert item.total == Decimal("4500.00")
        assert item.status == OrderItem.Status.pending

    def test_create_bill(self, sample_data):
        customer = sample_data["customer"]
        product = sample_data["product"]
        address = sample_data["address"]

        order = Order.objects.create(customer=customer)
        OrderItem.objects.create(order=order, product=product, quantity=1)

        bill = Bill.objects.create(cart=order, address=address)

        assert isinstance(bill, Bill)
        assert bill.status is False
        assert bill.address.street == "Main St"
        assert str(bill).startswith(f"{bill.cart}")

    def test_order_str(self, sample_data):
        customer = sample_data["customer"]
        order = Order.objects.create(customer=customer)
        assert str(order) == f"{customer.username},"
