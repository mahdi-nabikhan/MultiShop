import pytest
from django.urls import reverse


@pytest.mark.django_db
class TestTemplateViews:

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
