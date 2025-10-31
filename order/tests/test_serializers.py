import pytest
from decimal import Decimal
from rest_framework.test import APIRequestFactory
from account.models import User
from customer.models import Customer, Address
from vendor.models import Manager, Store
from website.models import Category, Product
from order.models import Order, OrderItem, Bill
from order.api.v1.serializer import OrderSerializer, OrderItemSerializer, BillSerilizers


@pytest.mark.django_db
class TestOrderSerializers:

    @pytest.fixture
    def sample_data(self):
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
            'customer': customer,
            'manager': manager,
            'store': store,
            'category': category,
            'product': product,
            'address': address
        }

    def test_order_serializer_create(self, sample_data):
        factory = APIRequestFactory()
        request = factory.post('/orders/')
        serializer = OrderSerializer(data={}, context={'request': request})
        request.user = sample_data['user']
        serializer.is_valid(raise_exception=True)
        order = serializer.save()

        assert isinstance(order, Order)
        assert order.customer == sample_data['customer']
        assert order.status is False

    def test_order_item_serializer_create(self, sample_data):
        factory = APIRequestFactory()
        request = factory.post(f"/orders/items/{sample_data['product'].pk}/")
        request.user = sample_data['user']

        serializer = OrderItemSerializer(
            data={'quantity': 2},
            context={'request': request, 'pk': sample_data['product'].pk}
        )
        serializer.is_valid(raise_exception=True)
        item = serializer.save()

        assert isinstance(item, OrderItem)
        assert item.product == sample_data['product']
        assert item.quantity == 2
        assert item.total == Decimal('3000.00')
        assert item.status == OrderItem.Status.pending

    def test_bill_serializer_create_and_representation(self, sample_data):
        order = Order.objects.create(customer=sample_data['customer'])

        serializer = BillSerilizers(
        data={'address': sample_data['address'].id},
        context={'pk': order.id}  # Order id به context
        )
        serializer.is_valid(raise_exception=True)
        bill = serializer.save()

        # بررسی ایجاد شدن bill
        assert isinstance(bill, Bill)
        assert bill.cart == order
        assert bill.address.id == sample_data['address'].id
        assert bill.status is False

        # بررسی representation
        rep = serializer.data
        # حالا rep['cart'] یک دیکشنری است
        assert rep['cart']['id'] == order.id
        assert rep['cart']['status'] == order.status
        assert rep['cart']['customer'] == order.customer.id