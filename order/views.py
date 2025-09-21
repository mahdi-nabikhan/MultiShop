from django.shortcuts import render
from django.views.generic import TemplateView


# Create your views here.


class OrderDetailView(TemplateView):
    template_name = 'orders/cart.html'
