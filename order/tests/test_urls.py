import pytest
from decimal import Decimal
from django.urls import reverse
from rest_framework.test import APIClient
from django.contrib.auth import get_user_model
from order.models import Order, OrderItem, Bill
from vendor.models import Manager, Store
from customer.models import Customer, Address
from website.models import *
User = get_user_model()

@pytest.mark.django_db
class TestOrderViews:

    @pytest.fixture
    def setup_data(self):
        # Users
        user = User.objects.create_user(email='user@test.com', password='pass123')
        manager_user = User.objects.create_user(email='manager@test.com', password='pass123')

        # Manager and Store
        manager = Manager.objects.create(user=manager_user, first_name='M', last_name='U')
        store = Store.objects.create(manager=manager, name='Tech Store', description='Store Description')

        # Customer
        customer = Customer.objects.create(user=user, username='customer1')

        # Category and Product
        category = Category.objects.create(title='Electronics', image='cat.png', description='Electronics')
        product = Product.objects.create(
            name='Laptop',
            description='Powerful Laptop',
            price=Decimal('1200.00'),
            quantity_in_stock=5,
            store=store,
            category=category
        )

        # Address
        address = Address.objects.create(customer=customer, street='Main St', city='Tehran', state='Tehran', postal_code='12345')

        return {
            'user': user,
            'manager_user': manager_user,
            'manager': manager,
            'store': store,
            'customer': customer,
            'category': category,
            'product': product,
            'address': address
        }

    # -------------------- Order List & Create --------------------
    def test_order_list_create(self, setup_data):
        client = APIClient()
        client.force_authenticate(user=setup_data['user'])
        url = reverse('order:order_api_vi:order-list')

        # POST -> create order
        response = client.post(url, {'customer': setup_data['customer'].id})
        assert response.status_code == 201
        assert Order.objects.filter(customer=setup_data['customer']).exists()

        # GET -> list orders
        response = client.get(url)
        assert response.status_code == 200

    # -------------------- Order Item --------------------
    def test_order_item_create_list_detail_update_delete(self, setup_data):
        client = APIClient()
        client.force_authenticate(user=setup_data['user'])

        order = Order.objects.create(customer=setup_data['customer'])
        product = setup_data['product']

        # Create OrderItem
        url_create = reverse('order:order_api_vi:order-item-create', args=[product.id])
        response = client.post(url_create, {'order': order.id, 'quantity': 2})
        assert response.status_code == 201
        item = OrderItem.objects.get(order=order, product=product)

        # List OrderItems
        url_list = reverse('order:order_api_vi:customer_order_item')
        response = client.get(url_list)
        assert response.status_code == 200

        # Detail
        url_detail = reverse('order:order_api_vi:order_item_detail', args=[item.id])
        response = client.get(url_detail)
        assert response.status_code == 200

        # Update
        response = client.put(url_detail, {'order': order.id, 'product': product.id, 'quantity': 5})
        assert response.status_code == 200
        item.refresh_from_db()
        assert item.quantity == 5

        # Delete
        response = client.delete(url_detail)
        assert response.status_code == 204
        assert not OrderItem.objects.filter(id=item.id).exists()

    # -------------------- Shop Order List --------------------
    def test_shop_order_list(self, setup_data):
        client = APIClient()
        client.force_authenticate(user=setup_data['manager_user'])

        order = Order.objects.create(customer=setup_data['customer'])
        OrderItem.objects.create(order=order, product=setup_data['product'], quantity=2)

        url = reverse('order:order_api_vi:shop_order_item')
        response = client.get(url)
        assert response.status_code == 200

    # -------------------- Bill Creation --------------------
    def test_bill_creation(self, setup_data):
        client = APIClient()
        client.force_authenticate(user=setup_data['user'])

        order = Order.objects.create(customer=setup_data['customer'])

        url = reverse('order:order_api_vi:bill-creation', args=[order.id])
        response = client.post(url)
        assert response.status_code == 201
        assert Bill.objects.filter(order=order).exists()
