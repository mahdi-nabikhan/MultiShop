from typing import Any
from django.shortcuts import render
from vendor.models import *
from .models import *

from django.views import View

from django.core.paginator import Paginator
from django.shortcuts import render
from django.views import generic
from django.views import View


# Create your views here.


class AllShopView(View):
    """
    View to display all stores (shops) in the system.

    Responsibilities
    ----------------
    - GET: Retrieve all Store objects and render them in an index template.

    Attributes
    ----------
    template_name : str
        - The template file used for rendering the list of stores.

    Methods
    -------
    get(self, request)
        - Handles GET requests.
        - Fetches all stores from the database.
        - Prints the authenticated user to console (for debugging).
        - Renders 'index.html' with context {'store_list': stores}.
        - Response: Rendered HTML page.

    Usage
    -----
        # List all stores
        GET /any-url-configured-for-this-view/  -> returns HTML page with store list

    Notes
    -----
    - No authentication is enforced; any user (anonymous or authenticated) can view stores.
    - The printed user in console is only for logging purposes.
    """
    
    template_name = 'index.html'

    def get(self, request):
        stores = Store.objects.all()
        print('this is your user',request.user)
        return render(request, self.template_name, {'store_list': stores})


class StoreProductsViews(View):
    """
    View to display all products of a specific store.

    Responsibilities
    ----------------
    - GET: Fetch a single store by primary key and list all its related products.

    Attributes
    ----------
    model : Store
        - The Store model used to retrieve the store instance.
    template_name : str
        - Template file to render the store and its products.

    Methods
    -------
    get(self, request, pk)
        - Handles GET requests with a store primary key.
        - Retrieves the Store object using `pk`.
        - Filters all Product objects belonging to that store.
        - Renders 'index.html' with context: {'store': store, 'products': product}.
        - Returns HTTP response with rendered template.

    Usage
    -----
        # View products of a store
        GET /<path-to-view>/<store_pk>/  -> shows store details and product list

    Notes
    -----
    - Assumes that the store with the given `pk` exists; otherwise raises `Store.DoesNotExist` (unhandled).
    - No pagination applied – all products are displayed at once.
    """
    model = Store
    template_name = 'index.html'

    def get(self, request, pk):
        store = self.model.objects.get(pk=pk)
        product = Product.objects.filter(store=store)
        context = {'store': store, 'products': product}
        return render(request=request, context=context, template_name=self.template_name)


class ProductsDetailView(generic.DetailView):
    """
    Generic detail view for a single product.

    Responsibilities
    ----------------
    - GET: Display detailed information of one product based on its primary key.

    Attributes
    ----------
    model : Product
        - The Product model to retrieve.
    context_object_name : str
        - Name of the context variable available in template ('product').
    pk_url_kwarg : str
        - URL keyword argument expected for primary key ('pk').
    template_name : str
        - Template file for rendering product detail.

    Methods
    -------
    (inherited from generic.DetailView)
        - Automatically handles GET and passes the product object to template.

    Usage
    -----
        # View product details
        GET /<product_pk>/  -> returns HTML page with product context.

    Notes
    -----
    - Uses Django's built-in DetailView, so no explicit `get` method is required.
    - If product does not exist, raises 404 automatically.
    """
    model = Product
    context_object_name = 'product'
    pk_url_kwarg = 'pk'
    template_name = 'product_detail.html'


class ShopDetailView(generic.DetailView):
    """
    Detail view for a single store, including paginated product list and addresses.

    Responsibilities
    ----------------
    - GET: Display store details, paginated list of its products (4 per page), and related addresses.

    Attributes
    ----------
    model : Store
        - The Store model for detail view.
    context_object_name : str
        - Context variable name for store object ('store').
    pk_url_kwarg : str
        - URL keyword for primary key ('pk').
    template_name : str
        - Template file for rendering store detail.

    Methods
    -------
    get_context_data(self, **kwargs)
        - Extends parent's context data.
        - Adds paginated product list (using Paginator with 4 items per page).
        - Retrieves current page number from GET parameters.
        - Adds store addresses queryset (ShopAddress.filter(store=store)).
        - Returns modified context dictionary.

    Usage
    -----
        # View store detail with paginated products
        GET /store/<pk>/  -> shows store info, page of products, and addresses.
        GET /store/<pk>/?page=2 -> shows second page of products.

    Notes
    -----
    - Products are ordered by 'id'.
    - Paginator is hardcoded to 4 items per page.
    - Addresses are not paginated; all are shown.
    """
    model = Store
    context_object_name = 'store'
    pk_url_kwarg = 'pk'
    template_name = 'detail.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        store = self.get_object()

        product_list = Product.objects.filter(store=store).order_by('id')
        paginator = Paginator(product_list, 4)

        page_number = self.request.GET.get('page')
        page_obj = paginator.get_page(page_number)

        context['products'] = page_obj
        context['address'] = ShopAddress.objects.filter(store=store)
        return context
