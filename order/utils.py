from decimal import Decimal
from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction

from website.models import Product

from customer.models import Customer
from order.sessions import CartSession, CART_SESSION_ID


@transaction.atomic
def transfer_session_cart_to_db(request, user):
    """
    Transfer the current session-based cart to the database for a given user.

    This function converts the items stored in the user's session cart into
    persistent Order and OrderItem objects in the database. If an active order 
    (status=False) exists for the customer, items are merged into it; otherwise, 
    a new order is created.

    Parameters:
    -----------
    request : HttpRequest
        The current request object containing the session data.
    user : User
        The Django User instance for whom the cart will be transferred.

    Returns:
    --------
    Order or None
        Returns the created or updated Order instance if the transfer is successful.
        Returns None if the customer does not exist or the cart is empty.

    Behavior:
    ---------
    - Fetches the Customer associated with the given user.
    - Retrieves the session cart using CartSession.
    - Creates a new Order if none exists with status=False.
    - Iterates through each item in the session cart:
        - If the item already exists in the order, updates the quantity and total.
        - Otherwise, creates a new OrderItem.
    - Clears the session cart and marks the session as modified.
    """
    
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
