from django.urls import path
from .views import *

app_name = 'api/v1'
urlpatterns = [
    path('login/', CustomObtainAuthToken.as_view(), name='login'),
    path('profile/',ProfileApiView.as_view(), name='profile'),
    path('logout/', LogOutApiView.as_view(), name='logout'),
    path('jwt/token/login/',CustomeObtainPairView.as_view(),name='jwt_login'),
    path('change/password/',ChangePasswordView.as_view(),name='change-password'),
    path('send/reset/password',SendResetCodeApiView.as_view(),name='send_reset_code'),
    path('confirm/rest/password',VerifyResetCodeApiView.as_view(),name='confirm_reset_password'),
    path('me/',CheckMeAPIView.as_view(),name='chech_me')


]

"""
Authentication and account-related URL configurations.

This module defines all authentication, authorization, and account management
API endpoints, including login mechanisms, JWT-based authentication, profile
management, password change, logout, and password reset workflows.

Endpoints:
    - login/
        Token-based authentication endpoint using a custom auth token view.

    - profile/
        Retrieve or update the authenticated user's profile information.

    - logout/
        Invalidate user authentication and clear related session or token data.

    - jwt/token/login/
        JWT-based authentication endpoint that issues access and refresh tokens.

    - change/password/
        Allow authenticated users to change their current password securely.

    - send/reset/password/
        Initiates the password reset process by sending a verification code
        to the user's registered email address.

    - confirm/rest/password/
        Verifies the password reset code, authenticates the user, and issues
        JWT tokens stored in secure HTTP-only cookies.

Security Notes:
    - JWT tokens are issued via secure HTTP-only cookies to mitigate XSS attacks.
    - Password reset endpoints are public but protected by time-limited codes.
    - Sensitive operations require validated serializers and strict permission handling.

Naming Conventions:
    - URL names are designed to be explicit and reusable for reverse lookups.
    - JWT-related endpoints are grouped under the `jwt/` prefix for clarity.

"""

