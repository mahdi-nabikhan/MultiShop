from decimal import Decimal
from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction

from website.models import Product

from customer.models import Customer
from order.sessions import CartSession, CART_SESSION_ID


@transaction.atomic
def transfer_session_cart_to_db(request, user):
    from order.models import Order, OrderItem 
    try:
        customer = Customer.objects.get(user=user)
    except ObjectDoesNotExist:
        return None

    cart = CartSession(request)
    if not getattr(cart, "cart", None):
        return None

    order, created = Order.objects.get_or_create(customer=customer, status=False)

    for item in cart:
        product = item.get('product')
        quantity = int(item.get('quantity', 1))
        existing_item = OrderItem.objects.filter(order=order, product=product).first()

        if existing_item:
            existing_item.quantity += quantity
            existing_item.total = Decimal(existing_item.product.price) * existing_item.quantity
            existing_item.save()
        else:
            OrderItem.objects.create(
                order=order,
                product=product,
                quantity=quantity,
                status=OrderItem.Status.pending,
                total=Decimal(product.price) * quantity,
            )

    request.session[CART_SESSION_ID] = {}
    request.session.modified = True

    return order
