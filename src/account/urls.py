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
"""
Root URL configuration for authentication, API access, and checkout redirection.

This module defines top-level URL routes for the application, including
versioned API endpoints, multiple authentication mechanisms (session-based
and JWT-based), checkout redirection logic, and password reset initiation
via template-based views.

URL Patterns:
    - api/v1/
        Entry point for versioned REST API endpoints.
        Routes are delegated to `account.api.v1.urls`.

    - login/
        Traditional authentication endpoint using server-rendered templates
        or session-based login.

    - login/jwt/
        JWT-based authentication endpoint for stateless clients such as
        SPAs and mobile applications.

    - checkout/redirect/
        Handles post-checkout redirection logic, typically used after
        successful or failed payment processes.

    - resend/password
        Template-based view for re-sending password reset instructions or
        verification codes to the user.

Design Notes:
    - API endpoints are versioned to ensure backward compatibility.
    - Authentication strategies are separated to support multiple client types.
    - Sensitive authentication and password-related flows are isolated
      into dedicated endpoints for clarity and security.

"""
