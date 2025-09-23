CART_SESSION_ID = 'cart'
from website.models import Product


class CartSession:
    def __init__(self, request):
        self.session = request.session
        cart = self.session.get(CART_SESSION_ID)
        if not cart:
            cart = self.session[CART_SESSION_ID] = {}

        self.cart = cart

    def add(self, product, quantity):
        unique = self.unique_id_generator(product.id)
        if unique in self.cart:
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
            item['product'] = Product.objects.get(id=int(item['id']))
            item['total_price'] = int(item['product'].price) * int(item['quantity'])
            yield item


