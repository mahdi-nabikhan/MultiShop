import pytest
from account.models import *

@pytest.mark.django_db
class TestUserModel:
    """
    Test suite for the custom User model.

    ---
    **Purpose:**
        Verifies correct behavior of user creation methods including standard users
        and superusers, and validates constraints such as mandatory email.

    ### Test Cases:

    1. `test_create_user`:
        - Tests creation of a standard user using `User.objects.create_user`.
        - Validates:
            - `email` is set correctly.
            - `is_active` is True.
            - `is_staff` is False.
            - Password is hashed and check_password returns True.

    2. `test_create_user_without_email`:
        - Tests that creating a user without providing an email raises `ValueError`.
        - Ensures model enforces email as a required field.

    3. `test_create_superuser`:
        - Tests creation of a superuser using `User.objects.create_superuser`.
        - Validates:
            - `email` is set correctly.
            - `is_superuser` is True.
            - `is_staff` is True.
            - `is_active` is True.

    ### Notes:
        - Uses `pytest.mark.django_db` to allow database operations.
        - Ensures custom user model behaves consistently with Django authentication expectations.
    """    

    
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
    