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
    template_name = 'index.html'

    def get(self, request):
        stores = Store.objects.all()
        print('this is your user',request.user)
        return render(request, self.template_name, {'store_list': stores})


class StoreProductsViews(View):
    model = Store
    template_name = 'index.html'

    def get(self, request, pk):
        store = self.model.objects.get(pk=pk)
        product = Product.objects.filter(store=store)
        context = {'store': store, 'products': product}
        return render(request=request, context=context, template_name=self.template_name)


class ProductsDetailView(generic.DetailView):
    model = Product
    context_object_name = 'product'
    pk_url_kwarg = 'pk'
    template_name = 'product_detail.html'


class ShopDetailView(generic.DetailView):
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
