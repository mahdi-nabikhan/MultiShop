import pytest
from django.urls import reverse


@pytest.mark.django_db
class TestTemplateViews:
    """
    Test suite for Django template-based authentication views.

    ---
    **Purpose:**
        Ensures that the login and JWT login template views render correctly
        and return expected HTTP status codes.

    ### Test Cases:

    1. `test_login_view`:
        - Sends a GET request to the login page.
        - Validates:
            - HTTP status code is 200 OK.
            - Correct template `accounts/login.html` is used.
            - Optional check: Response content includes the word "login".

    2. `test_jwt_login_view`:
        - Sends a GET request to the JWT login page.
        - Validates:
            - HTTP status code is 200 OK.
            - Correct template `accounts/jwt_login.html` is used.
            - Optional check: Response content includes the word "jwt".

    ### Notes:
        - Uses Django test `client` fixture for GET requests.
        - Optional content checks can be expanded to verify form fields or other page elements.
        - Primarily intended to catch template rendering errors.
    """

    def test_login_view(self, client):
        url = reverse("account:login")
        response = client.get(url)

        assert response.status_code == 200
        assert "accounts/login.html" in [t.name for t in response.templates]
        assert b"login" in response.content.lower()  # optional check

    def test_jwt_login_view(self, client):
        url = reverse("account:jwt_login")
        response = client.get(url)

        assert response.status_code == 200
        assert "accounts/jwt_login.html" in [t.name for t in response.templates]
        assert b"jwt" in response.content.lower()  # optional check
