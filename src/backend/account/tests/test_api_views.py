
import pytest

from django.conf import settings
from django.contrib.auth import get_user_model
from django.test import override_settings
from django.urls import reverse

from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from customer.models import Customer
from vendor.models import Admin, Manager, Operator, Store


User = get_user_model()


# ------------------------------------------------------------------
# Fixtures
# ------------------------------------------------------------------

@pytest.fixture
def user(db):
    return User.objects.create_user(
        email="mahdi@test.com",
        password="12345678",
    )


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def tokens(user):
    refresh = RefreshToken.for_user(user)

    return {
        "access": str(refresh.access_token),
        "refresh": str(refresh),
    }


@pytest.fixture
def create_user(db):
    return User.objects.create_user(
        email="user@example.com",
        password="testpass123",
    )


@pytest.fixture
def create_manager(create_user):
    return Manager.objects.create(
        user=create_user,
        first_name="ManagerFirst",
        last_name="ManagerLast",
    )


@pytest.fixture
def create_store(create_manager):
    return Store.objects.create(
        manager=create_manager,
        name="Test Shop",
        description="Test Description",
    )


@pytest.fixture
def create_customer(create_user):
    return Customer.objects.create(user=create_user)


@pytest.fixture
def create_admin(create_user, create_store):
    return Admin.objects.create(
        user=create_user,
        shop=create_store,
        username="admin1",
    )


@pytest.fixture
def create_operator(create_user, create_store):
    return Operator.objects.create(
        user=create_user,
        shop=create_store,
        username="operator1",
    )


# ------------------------------------------------------------------
# Authentication API
# ------------------------------------------------------------------

@pytest.mark.django_db
class TestAuthAPI:

    def test_login_success(self, create_user, api_client):
        response = api_client.post(
            reverse("account:api/v1:login"),
            {
                "email": "user@example.com",
                "password": "testpass123",
            },
        )

        assert response.status_code == status.HTTP_200_OK
        assert "user-id" in response.data
        assert "token" in response.data

    def test_login_invalid_credentials(self, api_client):
        response = api_client.post(
            reverse("account:api/v1:login"),
            {
                "email": "wrong@example.com",
                "password": "wrongpass",
            },
        )

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_get_profile(self, create_user, api_client):
        api_client.force_authenticate(user=create_user)

        response = api_client.get(
            reverse("account:api/v1:profile")
        )

        assert response.status_code == status.HTTP_200_OK
        assert response.data["email"] == create_user.email

    def test_logout(self, create_user, api_client):
        Token.objects.create(user=create_user)
        api_client.force_authenticate(user=create_user)

        response = api_client.post(
            reverse("account:api/v1:logout")
        )

        assert response.status_code == status.HTTP_200_OK
        assert response.data["success"] is True
        assert response.data["message"] == "Logout successfully."

    def test_change_password(self, create_user, api_client):
        api_client.force_authenticate(user=create_user)

        response = api_client.put(
            reverse("account:api/v1:change-password"),
            {
                "old_password": "testpass123",
                "new_password": "newpass456",
                "new_password1": "newpass456",
            },
            format="json",
        )

        assert response.status_code == status.HTTP_200_OK

        create_user.refresh_from_db()
        assert create_user.check_password("newpass456")

    @pytest.mark.parametrize(
        "role_fixture, expected_redirect",
        [
            ("create_customer", "shop_list"),
            ("create_admin", "panel"),
            ("create_operator", "panel"),
        ],
    )
    @override_settings(
        REST_FRAMEWORK={
            **settings.REST_FRAMEWORK,
            "DEFAULT_THROTTLE_RATES": {
                **settings.REST_FRAMEWORK.get(
                    "DEFAULT_THROTTLE_RATES", {}
                ),
                "login": "100/minute",
            },
        }
    )
    def test_jwt_login_redirect(
        self,
        request,
        api_client,
        role_fixture,
        expected_redirect,
    ):
        role_instance = request.getfixturevalue(role_fixture)
        role_user = role_instance.user

        response = api_client.post(
            reverse("account:api/v1:jwt_login"),
            {
                "email": role_user.email,
                "password": "testpass123",
            },
        )

        assert response.status_code == status.HTTP_200_OK
        assert response.data["redirect_url"] == expected_redirect


# ------------------------------------------------------------------
# JWT Logout API
# ------------------------------------------------------------------

@pytest.mark.django_db
class TestLogoutAPIView:

    def test_logout_success(self, api_client, user, tokens):
        api_client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {tokens['access']}"
        )
        api_client.cookies["refresh_token"] = tokens["refresh"]

        response = api_client.post(
            reverse("account:api/v1:logout")
        )

        assert response.status_code == status.HTTP_200_OK
        assert response.data["success"] is True
        assert response.data["message"] == "Logout successfully."

        assert response.cookies["access_token"].value == ""
        assert response.cookies["refresh_token"].value == ""

    def test_logout_without_refresh_cookie(self, api_client, user, tokens):
        api_client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {tokens['access']}"
        )

        response = api_client.post(
            reverse("account:api/v1:logout")
        )

        assert response.status_code == status.HTTP_200_OK
        assert response.data["success"] is True

    def test_logout_unauthenticated(self, api_client):
        response = api_client.post(
            reverse("account:api/v1:logout")
        )

        assert response.status_code == status.HTTP_401_UNAUTHORIZED


# ------------------------------------------------------------------
# Check Me API
# ------------------------------------------------------------------

@pytest.mark.django_db
class TestCheckMeAPIView:

    def test_authenticated_user_can_get_profile(
        self,
        api_client,
        user,
        tokens,
    ):
        api_client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {tokens['access']}"
        )

        response = api_client.get(
            reverse("account:api/v1:chech_me")
        )

        assert response.status_code == status.HTTP_200_OK
        assert response.data["pk"] == user.pk
        assert response.data["email"] == user.email

    def test_unauthenticated_user_cannot_get_profile(self, api_client):
        response = api_client.get(
            reverse("account:api/v1:chech_me")
        )

        assert response.status_code == status.HTTP_401_UNAUTHORIZED