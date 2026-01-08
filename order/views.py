from django.shortcuts import render, redirect
from django.views.generic import TemplateView, View
from website.models import *
from .sessions import *


# Create your views here.


class OrderDetailView(View):
    """
    Display the current user's shopping cart.

    This view retrieves the cart stored in the session using `CartSession`
    and renders it in the 'orders/cart.html' template.

    Attributes:
    -----------
    template_name : str
        The template used to render the cart page.

    Methods:
    --------
    get(request):
        Handles GET requests to display the current session cart.
        Passes the cart object to the template context.
    """
    template_name = 'orders/cart.html'

    def get(self, request):
        cart = CartSession(request)
        context = {'cart': cart}
        return render(request, self.template_name, context)


class CartAddView(View):
    """
    Add a product to the shopping cart stored in the session.

    This view handles POST requests to add a specific product to the user's
    cart. The product is identified by its primary key (`pk`) and the
    quantity is taken from the POST data. If the product is already in the
    cart, its quantity is incremented.

    Methods:
    --------
    post(request, pk):
        Handles POST requests to add a product to the session cart.

        Parameters:
        -----------
        request : HttpRequest
            The HTTP request object containing POST data.
        pk : int
            The primary key of the product to be added to the cart.

        Returns:
        --------
        HttpResponseRedirect
            Redirects the user to the cart detail page after adding the product.
    """
    def post(self, request, pk):
        product = Product.objects.get(pk=pk)
        quantity = int(request.POST['quantity'])
        cart = CartSession(request)
        cart.add(product, quantity)
        cart.save()
        return redirect('order:order-detail')


class CartDeleteView(View):
    """
    Delete a product from the shopping cart stored in the session.

    This view handles GET requests to remove a specific product from the user's
    cart. The product is identified by its ID. If the product does not exist
    in the cart, nothing happens.

    Methods:
    --------
    get(request, id):
        Handles GET requests to remove a product from the session cart.

        Parameters:
        -----------
        request : HttpRequest
            The HTTP request object.
        id : int
            The ID of the product to be removed from the cart.

        Returns:
        --------
        HttpResponseRedirect
            Redirects the user to the cart detail page after removing the product.
    """
    def get(self, request, id):
        cart = CartSession(request)
        cart.delete(id)
        return redirect('order:order-detail')


class ShopOrderTemplateView(TemplateView):
    """
    Display a list of all order items for the store managed by the logged-in manager.

    This view renders the 'orders/shop_orders.html' template and is intended
    for store managers to see all order items related to their store's products.

    Attributes:
    -----------
    template_name : str
        The name of the template used to render the view.
    """
    template_name = 'orders/shop_orders.html'

class CustomerOrderitemTemplateView(TemplateView):
    """
    Display all order items for the currently logged-in customer.

    This view renders the 'orders/api_order_item.html' template and is intended
    for customers to see all items in their current active order (cart).

    Attributes:
    -----------
    template_name : str
        The name of the template used to render the view.
    """
    template_name='orders/api_order_item.html'