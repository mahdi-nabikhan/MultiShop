from django.shortcuts import render, redirect
from django.views.generic import TemplateView, View
from website.models import *
from .sessions import *


# Create your views here.


class OrderDetailView(View):
    template_name = 'orders/cart.html'

    def get(self, request):
        cart = CartSession(request)
        context = {'cart': cart}
        return render(request, self.template_name, context)


class CartAddView(View):
    def post(self, request, id):
        product = Product.objects.get(id=id)
        quantity = int(request.POST['quantity'])
        cart = CartSession(request)
        cart.add(product, quantity)
        cart.save()
        return redirect('order-detail')


class CartDeleteView(View):
    def get(self, request, id):
        cart = CartSession(request)
        cart.delete(id)
        return redirect('order-detail')


class ShopOrderTemplateView(TemplateView):
    template_name = 'orders/shop_orders.html'
