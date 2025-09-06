from django.shortcuts import render
from django.views.generic import TemplateView


# Create your views here.

class PanelTemplateView(TemplateView):
    template_name = 'vendor/panel.html'
