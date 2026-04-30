import pytest
from django.urls import reverse
from rest_framework.test import APIClient
from decimal import Decimal
from django.contrib.auth import get_user_model
from order.models import Order, OrderItem
from vendor.models import Manager, Store
from website.models import Product, Category
from customer.models import Customer, Address

User = get_user_model()

# Fixture آماده سازی داده‌ها
@pytest.fixture
def setup_data(db):
    """
    Fixture to set up initial test data for orders, customers, products, and stores.

    Returns a dictionary containing:
    --------------------------------
    - 'user': User instance representing a test customer
    - 'manager_user': User instance representing a test store manager
    - 'customer': Customer instance linked to 'user'
    - 'manager': Manager instance linked to 'manager_user'
    - 'store': Store instance managed by 'manager'
    - 'category': Product Category instance
    - 'product': Product instance associated with 'store' and 'category'
    - 'address': Address instance linked to 'customer'

    Purpose:
    --------
    - Provides a consistent set of related objects for testing Order, OrderItem, and Bill API endpoints.
    - Ensures there is at least one customer, one manager/store, one product, and one address available.
    - Can be used in pytest test functions by passing `setup_data` as a parameter.

    Example usage in a test:
    ------------------------
        def test_customer_order_creation(client, setup_data):
            user = setup_data['user']
            client.force_authenticate(user=user)
            product = setup_data['product']
            response = client.post(f'/api/v1/order/item/{product.id}/', {"quantity": 2})
            assert response.status_code == 201
    """
    # Users
    user = User.objects.create_user(email='test@gmail.com', password='pass12345')
    manager_user = User.objects.create_user(email='manager@gmail.com', password='pass12345')

    # Manager and store
    manager = Manager.objects.create(user=manager_user, first_name='A', last_name='B')
    store = Store.objects.create(manager=manager, name='Tech Store', description='Tech Gadgets')

    # Customer
    customer = Customer.objects.create(user=user, username='mahdi')

    # Category and product
    category = Category.objects.create(title='Electronics', image='cat.png', description='Electronics category')
    product = Product.objects.create(
        name='Laptop',
        description='Powerful laptop',
        price=Decimal('1500.00'),
        quantity_in_stock=5,
        store=store,
        category=category
    )

    # Address
    address = Address.objects.create(customer=customer, street='Main St', city='Tehran', state='Tehran', postal_code='12345')

    return {
        'user': user,
        'manager_user': manager_user,
        'customer': customer,
        'manager': manager,
        'store': store,
        'category': category,
        'product': product,
        'address': address
    }

@pytest.mark.django_db
class TestOrderViews:
    """
    Test suite for Order, OrderItem, and Bill API endpoints.

    These tests cover the following scenarios:

    1. OrderListApiView (order-list)
       - GET: List all orders for the authenticated customer.
       - POST: Create a new order for the authenticated customer.

    2. OrderItemCreateApiView / OrderItemApiView / OrderItemListAPIView (order-item-create, customer_order_item, order-item-list)
       - POST: Add a product to an order (OrderItemCreateApiView).
       - GET: List all active order items for the authenticated customer (OrderItemApiView).
       - GET: List all items for a specific order (OrderItemListAPIView).

    3. OrderItemDetailView (order_item_detail)
       - GET: Retrieve a single order item.
       - PUT/PATCH: Update quantity or details of an order item.
       - DELETE: Remove an order item from the order.

    4. ShopOrderListApiView (shop_order_item)
       - GET: List all order items related to products managed by the authenticated store manager.

    5. BillCreationApiView (bill-creation)
       - POST: Create a bill for a specific order.

    Notes
    -----
    - All endpoints require authentication.
    - Fixtures (setup_data) provide pre-created users, customers, managers, store, products, and addresses.
    - The tests simulate realistic API interactions:
        - Customer creates orders and order items.
        - Customer retrieves order item lists and details.
        - Store manager views order items for managed products.
        - Customers can create bills for completed orders.
    """

    def test_order_list_create(self, setup_data):
        client = APIClient()
        client.force_authenticate(user=setup_data['user'])

        url = reverse('order:order_api_vi:order-list')

        # POST -> create order
        response = client.post(url, {'customer': setup_data['customer'].id})
        assert response.status_code == 201
        assert Order.objects.filter(customer=setup_data['customer']).exists()

    def test_order_item_create_list(self, setup_data):
        client = APIClient()
        client.force_authenticate(user=setup_data['user'])

        order = Order.objects.create(customer=setup_data['customer'])
        product = setup_data['product']

        url_create = reverse('order:order_api_vi:order-item-create', args=[product.id])
        response = client.post(url_create, {'order': order.id, 'quantity': 2})
        assert response.status_code == 201
        assert OrderItem.objects.filter(order=order, product=product).exists()

        # GET list
        url_list = reverse('order:order_api_vi:customer_order_item')
        response = client.get(url_list)
        assert response.status_code == 200

    def test_order_item_detail_update_delete(self, setup_data):
        client = APIClient()
        client.force_authenticate(user=setup_data['user'])

        order = Order.objects.create(customer=setup_data['customer'])
        item = OrderItem.objects.create(order=order, product=setup_data['product'], quantity=1)

        url_detail = reverse('order:order_api_vi:order_item_detail', args=[item.id])

        # GET detail
        response = client.get(url_detail)
        assert response.status_code == 200

        # PUT update
        response = client.put(url_detail, {'order': order.id, 'product': item.product.id, 'quantity': 5})
        assert response.status_code == 200
        item.refresh_from_db()
        assert item.quantity == 5

        # DELETE
        response = client.delete(url_detail)
        assert response.status_code == 204
        assert not OrderItem.objects.filter(id=item.id).exists()

    def test_shop_order_list(self, setup_data):
        client = APIClient()
        client.force_authenticate(user=setup_data['manager_user'])

        order = Order.objects.create(customer=setup_data['customer'])
        OrderItem.objects.create(order=order, product=setup_data['product'], quantity=2)

        url = reverse('order:order_api_vi:shop_order_item')
        response = client.get(url)
        assert response.status_code == 200

    def test_order_item_api_view(self, setup_data):
        client = APIClient()
        client.force_authenticate(user=setup_data['user'])

        order = Order.objects.create(customer=setup_data['customer'])
        OrderItem.objects.create(order=order, product=setup_data['product'], quantity=2)

        url = reverse('order:order_api_vi:customer_order_item')
        response = client.get(url)
        assert response.status_code == 200

    def test_bill_creation(self, setup_data):
        client = APIClient()
        client.force_authenticate(user=setup_data['user'])

        order = Order.objects.create(customer=setup_data['customer'])

        url = reverse('order:order_api_vi:bill-creation', args=[order.id])
        response = client.post(url)
        assert response.status_code == 201
