from django.shortcuts import render
from django.views.generic import TemplateView,View


# Create your views here.

class PanelTemplateView(TemplateView):
    template_name = 'vendor/panel.html'

class AddProductTempalteView(TemplateView):
    template_name='vendor/adding_producs.html'
    
    
class AddAdminTemplateView(TemplateView):
    template_name ='vendor/register_admin.html'
    
    
class ProductDetailTemplteView(TemplateView):
    template_name='vendor/products_detail.html'
    
    
