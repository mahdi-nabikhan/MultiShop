from django.shortcuts import render
from django.views.generic import TemplateView


# Create your views here.


class LoginView(TemplateView):
    template_name = 'accounts/login.html'


class JwtLogin(TemplateView):
    template_name='accounts/jwt_login.html'