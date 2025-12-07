from django.urls import path, include
from .views import *

app_name = 'account'
urlpatterns = [
    path('api/v1/', include('account.api.v1.urls')),
    path('login/',LoginView.as_view(),name='login'),
    path('login/jwt/',JwtLogin.as_view(),name='jwt_login'),
    path('checkout/redirect/', CheckoutRedirectView.as_view(), name='checkout_redirect'),
    path('resend/password',SendResetPasswordTemplate.as_view(),name='resend')

]
