from django.shortcuts import render
from django.views.generic import TemplateView,View
    
from django.shortcuts import redirect
from django.urls import reverse
from django.views import View
from order.utils import transfer_session_cart_to_db
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

# Create your views here.


class LoginView(TemplateView):
    template_name = 'accounts/login.html'


class JwtLogin(TemplateView):
    template_name='accounts/jwt_login.html'
    


class CheckoutRedirectView(View):
    def get(self, request, *args, **kwargs):
        access_token = request.COOKIES.get('access_token')
        user = None

        if access_token:
            try:
                validated_token = JWTAuthentication().get_validated_token(access_token)
                user = JWTAuthentication().get_user(validated_token)
            except (InvalidToken, TokenError):
                user = None

        if not user:
            # اگه لاگین نیست → redirect به JWT login
            login_url = reverse('account:jwt_login')
            return redirect(login_url)

        # اگه لاگین بود → انتقال سشن به دیتابیس
        transfer_session_cart_to_db(request, user)

        # redirect به checkout واقعی
        return redirect('checkout_page')
