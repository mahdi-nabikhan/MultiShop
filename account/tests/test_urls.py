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

    #_______________________ Template View ___________________
    def test_login_url_resolves(self):
        url = reverse('account:login')
        assert resolve(url).func.view_class == LoginView

    def test_jwt_login_url_resolves(self):
        url = reverse('account:jwt_login')
        assert resolve(url).func.view_class == JwtLogin


class TestAccountAPIURLs:

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
