import pytest
from account.models import *

@pytest.mark.django_db
class TestUserModel:

    def test_create_user(self):
        user = User.objects.create_user(
            email="test@example.com",
            password="testpass123"
        )

        assert user.email == "test@example.com"
        assert user.is_active is True
        assert user.is_staff is False
        assert user.check_password("testpass123") is True

    def test_create_user_without_email(self):
        with pytest.raises(ValueError):
            User.objects.create_user(email=None, password="testpass123")

    def test_create_superuser(self):
        admin = User.objects.create_superuser(
            email="admin@example.com",
            password="adminpass123"
        )

        assert admin.email == "admin@example.com"
        assert admin.is_superuser is True
        assert admin.is_staff is True
        assert admin.is_active is True
