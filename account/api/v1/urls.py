from django.urls import path
from .views import *

app_name = 'api/v1'
urlpatterns = [
    path('login/', CustomObtainAuthToken.as_view(), name='login'),
    path('profile/',ProfileApiView.as_view(), name='profile'),
    path('logout/', LogOutApiView.as_view(), name='logout'),
    path('jwt/token/login/',CustomeObtainPairView.as_view(),name='jwt_login'),
    path('change/password/',ChangePasswordView.as_view(),name='change-password')


]
"""
API URL Configuration for version 1 of the project.

app_name = 'api/v1'

This module defines all REST API endpoints for user authentication,
profile management, and password operations. Each URL is mapped to its
corresponding view class.

### URL Patterns:

1. `login/` → `CustomObtainAuthToken`
    - Method: POST
    - Purpose: Authenticates a user using username/email and password,
      returns DRF Token, and role-based redirect URL.

2. `profile/` → `ProfileApiView`
    - Method: GET
    - Purpose: Retrieves the authenticated user's profile information
      (id, email).

3. `logout/` → `LogOutApiView`
    - Method: POST
    - Purpose: Deletes the authenticated user's token, logging them out.

4. `jwt/token/login/` → `CustomeObtainPairView`
    - Method: POST
    - Purpose: Authenticates a user, issues JWT access and refresh tokens,
      transfers session cart to database, and returns role-based redirect URL.
    - Throttle: `LoginRateThrottle`

5. `change/password/` → `ChangePasswordView`
    - Method: POST (assumed)
    - Purpose: Allows an authenticated user to change their password.

### Notes:
- All endpoints under `api/v1` namespace.
- Views are a mix of TokenAuthentication and JWTAuthentication.
- Permissions and throttling are defined within individual views.
"""
