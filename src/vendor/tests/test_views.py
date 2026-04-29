import pytest
from django.urls import reverse

@pytest.mark.django_db
class TestTemplateViews:

    def test_panel_view(self, client):
        url = reverse('vendors:panel')
        response = client.get(url)
        assert response.status_code == 200

    def test_add_product_template(self, client):
        url = reverse('vendors:adding_product')
        response = client.get(url)
        assert response.status_code == 200

    def test_add_admin_template(self, client):
        url = reverse('vendors:adding_admin')
        response = client.get(url)
        assert response.status_code == 200

    def test_product_detail_template(self, client):
        url = reverse('vendors:prodcut-detail')
        response = client.get(url)
        assert response.status_code == 200
