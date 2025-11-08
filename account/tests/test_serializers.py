import pytest
from account.api.v1.serializers import (
    LoginSerializer,
    UserSerializer,
    UsersSerializer,
    ChangePasswordSerializer,
)
from account.models import User


@pytest.mark.django_db
class TestUserSerializer:
    """
    Test suite for `UserSerializer`.

    ---
    **Purpose:**
        Validates user registration data, password confirmation, and creation logic.

    ### Test Cases:

    1. `test_valid_data`:
        - Ensures serializer accepts valid data with matching passwords.
        - Checks that the user is created in the database.

    2. `test_password_mismatch`:
        - Ensures serializer rejects data when `password` and `password2` do not match.
        - Validates that appropriate validation error is returned.
    """
    def test_valid_data(self):
        data = {
            "email": "test@example.com",
            "password": "StrongPass123!",
            "password2": "StrongPass123!",
        }
        serializer = UserSerializer(data=data)
        assert serializer.is_valid() is True
        user = serializer.save()
        assert User.objects.filter(email=user.email).exists()

    def test_password_mismatch(self):
        data = {
            "email": "test@example.com",
            "password": "Pass123!",
            "password2": "Pass1234!",
        }
        serializer = UserSerializer(data=data)
        assert serializer.is_valid() is False
        assert "invalid password" in str(serializer.errors).lower()


@pytest.mark.django_db
class TestLoginSerializer:
    """
    Test suite for `LoginSerializer`.

    ---
    **Purpose:**
        Validates login credentials and serializer authentication logic.

    ### Fixtures:
        - `create_user`: Creates a user for authentication tests.

    ### Test Cases:

    1. `test_login_success`:
        - Ensures serializer is valid with correct email and password.

    2. `test_login_fail`:
        - Ensures serializer is invalid with incorrect credentials.
        - Validates appropriate error is raised.
    """
    @pytest.fixture
    def create_user(self):
        return User.objects.create_user(
            email="login@example.com", password="Login123!"
        )

    def test_login_success(self, create_user):
        serializer = LoginSerializer(
            data={"email": "login@example.com", "password": "Login123!"}
        )
        assert serializer.is_valid() is True

    def test_login_fail(self):
        serializer = LoginSerializer(
            data={"email": "wrong@example.com", "password": "Wrong123!"}
        )
        assert serializer.is_valid() is False


@pytest.mark.django_db
class TestUsersSerializer:
    """
    Test suite for `UsersSerializer`.

    ---
    **Purpose:**
        Validates serialization of basic user information (id and email).

    ### Test Cases:

    1. `test_fields_output`:
        - Checks that serialized data contains `id` and `email`.
        - Ensures `email` matches the user instance.
    """
    def test_fields_output(self):
        user = User.objects.create_user(email="abc@test.com", password="test1234")
        serializer = UsersSerializer(user)
        assert "email" in serializer.data
        assert "id" in serializer.data
        assert serializer.data["email"] == user.email


@pytest.mark.django_db
class TestChangePasswordSerializer:
    """
    Test suite for `ChangePasswordSerializer`.

    ---
    **Purpose:**
        Validates password change logic, including matching new passwords
        and enforcing password rules.

    ### Test Cases:

    1. `test_password_match_and_valid`:
        - Ensures serializer is valid when new passwords match and satisfy
          validation requirements.

    2. `test_password_mismatch`:
        - Ensures serializer is invalid when new passwords do not match.
        - Validates correct validation error message is returned.
    """
    def test_password_match_and_valid(self):
        data = {
            "old_password": "OldPass123!",
            "new_password": "StrongPass123!",
            "new_password1": "StrongPass123!",
        }
        serializer = ChangePasswordSerializer(data=data)
        assert serializer.is_valid() is True

    def test_password_mismatch(self):
        data = {
            "old_password": "OldPass123!",
            "new_password": "StrongPass123!",
            "new_password1": "WrongPass123!",
        }
        serializer = ChangePasswordSerializer(data=data)
        assert serializer.is_valid() is False
        assert "passwords do not match" in str(serializer.errors).lower()
