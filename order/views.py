from django.shortcuts import render, redirect
from django.views.generic import TemplateView, View


# Create your views here.


class OrderDetailView(TemplateView):
    template_name = 'orders/cart.html'


class CartAddView(View):
    def post(self, request):
        return redirect('orders:cart')
