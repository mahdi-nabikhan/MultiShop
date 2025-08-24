from django.shortcuts import render
from django.views.generic import TemplateView


# Create your views here.

class CostumerRegisterTemplateView(TemplateView):
    template_name = 'accounts/costomer_register.html'
