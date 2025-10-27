import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework.authtoken.models import Token
from django.urls import reverse
from customer.models import Customer
from vendor.models import Admin, Manager, Operator, Store

User = get_user_model()


@pytest.mark.django_db
class TestAuthAPI:

    # ---------------------- Fixtures ----------------------
    @pytest.fixture
    def api_client(self):
        return APIClient()

    @pytest.fixture
    def create_user(self):
        return User.objects.create_user(
            email="user@example.com",
            password="testpass123"
        )

    @pytest.fixture
    def create_manager(self, create_user):
        return Manager.objects.create(
            user=create_user,
            first_name="ManagerFirst",
            last_name="ManagerLast"
        )

    @pytest.fixture
    def create_store(self, create_manager):
        return Store.objects.create(
            manager=create_manager,
            name="Test Shop",
            description="Test Description"
        )

    @pytest.fixture
    def create_customer(self, create_user):
        return Customer.objects.create(user=create_user)

    @pytest.fixture
    def create_admin(self, create_user, create_store):
        return Admin.objects.create(
            user=create_user,
            shop=create_store,
            username="admin1"
        )

    @pytest.fixture
    def create_manager_role(self, create_user, create_store):
        return Manager.objects.create(
            user=create_user,
        )

    @pytest.fixture
    def create_operator(self, create_user, create_store):
        return Operator.objects.create(
            user=create_user,
            shop=create_store,
            username="operator1"
        )

    # ---------------------- Token Login ----------------------
    def test_login_success(self, create_user, api_client):
        url = reverse('account:api/v1:login')
        response = api_client.post(url, {
            "email": "user@example.com",
            "password": "testpass123"
        })
        assert response.status_code == 200
        assert "user-id" in response.data
        assert "token" in response.data

    def test_login_invalid_credentials(self, api_client):
        url = reverse('account:api/v1:login')
        response = api_client.post(url, {
            "email": "wrong@example.com",
            "password": "wrongpass"
        })
        assert response.status_code == 400

    # ---------------------- Profile ----------------------
    def test_get_profile(self, create_user, api_client):
        api_client.force_authenticate(user=create_user)
        url = reverse('account:api/v1:profile')
        response = api_client.get(url)
        assert response.status_code == 200
        assert response.data["email"] == create_user.email

    # ---------------------- Logout ----------------------
    def test_logout(self, create_user, api_client):
        Token.objects.create(user=create_user)  
        api_client.force_authenticate(user=create_user)
        url = reverse('account:api/v1:logout')
        response = api_client.post(url)
        assert response.status_code == 200
        assert response.data['details'] == 'logged out successfully'

    # ---------------------- Change Password ----------------------
    def test_change_password(self, create_user, api_client):
        api_client.force_authenticate(user=create_user)
        url = reverse('account:api/v1:change-password')
        response = api_client.put(
        url,
        {
            "old_password": "testpass123",
            "new_password": "newpass456",
            "new_password1": "newpass456"
        },
        format='json'  
    )
        create_user.refresh_from_db()
        assert response.status_code == 200
        assert create_user.check_password("newpass456")


    # ---------------------- JWT Login + Redirect ----------------------
    @pytest.mark.parametrize("role_fixture,expected_redirect", [
        ("create_customer", "/website/shop/list/"),
        ("create_admin", "/vendor/panel"),
        ("create_operator", "/vendor/panel"),
    ])
    def test_jwt_login_redirect(self, request, api_client, role_fixture, expected_redirect):
        role_instance = request.getfixturevalue(role_fixture)
        api_client.force_authenticate(user=role_instance.user)
        url = reverse('account:api/v1:jwt_login')
        response = api_client.post(url, {
            "email": role_instance.user.email,
            "password": "testpass123"
        })
        assert response.status_code == 200
        assert response.data["redirect_url"] == expected_redirect
