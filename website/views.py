from django.shortcuts import render
from vendor.models import *
from .models import *
from django.views import generic
from django.views import View


# Create your views here.


class AllShopView(generic.ListView):
    model = Store
    queryset = Store.objects.all()
    context_object_name = 'store_list'
    template_name = 'index.html'
    paginate_by = 4


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


class ShopDetailView(generic.DetailView):
    model = Store
    context_object_name = 'store'
    pk_url_kwarg = 'pk'
    template_name = 'detail.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        store = self.get_object()
        context['products'] = Product.objects.filter(store=store)
        context['address'] = ShopAddress.objects.filter(store=store)
        return context
