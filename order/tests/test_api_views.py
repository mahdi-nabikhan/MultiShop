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
