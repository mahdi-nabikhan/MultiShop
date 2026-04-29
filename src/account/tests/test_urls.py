import pytest
from django.urls import reverse, resolve

from account.views import LoginView, JwtLogin
from account.api.v1.views import (
    CustomObtainAuthToken,
    ProfileApiView,
    LogOutApiView,
    CustomeObtainPairView,
    ChangePasswordView
)


pytestmark = pytest.mark.django_db


class TestAccountURLs:
    """
    Test suite for template-based authentication URLs.

    ---
    **Purpose:**
        Verifies that template view URLs are correctly mapped to their corresponding view classes.

    ### Test Cases:

    1. `test_login_url_resolves`:
        - Ensures `account:login` URL resolves to `LoginView`.

    2. `test_jwt_login_url_resolves`:
        - Ensures `account:jwt_login` URL resolves to `JwtLogin`.
    """


    #_______________________ Template View ___________________
    def test_login_url_resolves(self):
        url = reverse('account:login')
        assert resolve(url).func.view_class == LoginView

    def test_jwt_login_url_resolves(self):
        url = reverse('account:jwt_login')
        assert resolve(url).func.view_class == JwtLogin


class TestAccountAPIURLs:
    """
    Test suite for API authentication URLs (DRF views).

    ---
    **Purpose:**
        Ensures that API endpoint URLs correctly resolve to their respective DRF view classes.

    ### Test Cases:

    1. `test_api_login_url_resolves`:
        - Ensures `account:api/v1:login` resolves to `CustomObtainAuthToken`.

    2. `test_profile_url_resolves`:
        - Ensures `account:api/v1:profile` resolves to `ProfileApiView`.

    3. `test_logout_url_resolves`:
        - Ensures `account:api/v1:logout` resolves to `LogOutApiView`.

    4. `test_jwt_token_login_url_resolves`:
        - Ensures `account:api/v1:jwt_login` resolves to `CustomeObtainPairView`.

    5. `test_change_password_url_resolves`:
        - Ensures `account:api/v1:change-password` resolves to `ChangePasswordView`.

    ### Notes:
        - Uses `django.urls.resolve` to verify URL-to-view mapping.
        - Helps prevent misconfigurations in URL patterns after refactoring.
    """

    #__________________ API Views _________________________
    def test_api_login_url_resolves(self):
        url = reverse('account:api/v1:login')
        assert resolve(url).func.view_class == CustomObtainAuthToken

    def test_profile_url_resolves(self):
        url = reverse('account:api/v1:profile')
        assert resolve(url).func.view_class == ProfileApiView

    def test_logout_url_resolves(self):
        url = reverse('account:api/v1:logout')
        assert resolve(url).func.view_class == LogOutApiView

    def test_jwt_token_login_url_resolves(self):
        url = reverse('account:api/v1:jwt_login')
        assert resolve(url).func.view_class == CustomeObtainPairView

    def test_change_password_url_resolves(self):
        url = reverse('account:api/v1:change-password')
        assert resolve(url).func.view_class == ChangePasswordView
