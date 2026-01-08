CART_SESSION_ID = 'cart'
from website.models import Product


class CartSession:
    """
    Manage shopping cart using Django session.

    This class allows adding, iterating, and deleting products in a cart
    stored in the user's session.

    Attributes:
        session (SessionBase): Django session object from request.
        cart (dict): Dictionary storing cart items with unique keys.

    Methods:
        add(product, quantity): Add a product to the cart or update quantity.
        unique_id_generator(product_id): Generate a unique key for a product.
        save(): Mark the session as modified to persist changes.
        __iter__(): Iterate over cart items, attaching Product instances and total price.
        delete(id): Remove a product from the cart by product ID.
    """
    def __init__(self, request):
        self.session = request.session
        cart = self.session.get(CART_SESSION_ID)
        if not cart:
            cart = self.session[CART_SESSION_ID] = {}

        self.cart = cart

    def add(self, product, quantity):
        unique = self.unique_id_generator(product.id)
        if unique not in self.cart:
            self.cart[unique] = {'quantity': 0, 'price': str(product.price), 'id': str(product.id)}
        self.cart[unique]['quantity'] += int(quantity)

    @staticmethod
    def unique_id_generator(product_id):
        result = f'{product_id}'
        return result

    def save(self):
        self.session.modified = True

    def __iter__(self):
        cart = self.cart.copy()

        for item in cart.values():
            product = Product.objects.get(id=int(item['id']))
            item['product'] = product
            item['total_price'] = int(item['product'].price) * int(item['quantity'])
            item['unique_id'] = self.unique_id_generator(product.id)
            yield item

    def delete(self, id):
        unique = self.unique_id_generator(id)

        del self.cart[unique]
        self.save()
