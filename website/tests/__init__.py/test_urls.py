# website/tests/test_urls.py
import pytest
from django.urls import reverse, resolve
from vendor.models import User, Manager, Store


@pytest.mark.django_db
class TestWebsiteURLs:
    
    @pytest.mark.parametrize("url_name, kwargs", [
        ('shop-list', None),
        ('product-list', {'pk': 1}),
        ('shop-detail', {'pk': 1}),
        ('product-detail', {'pk': 1}),
    ])
    def test_urls_resolve(self, url_name, kwargs):
        """ بررسی اینکه URL ها درست resolve میشن """
        if kwargs:
            url = reverse(url_name, kwargs=kwargs)
        else:
            url = reverse(url_name)

        assert resolve(url).view_name == url_name

    def test_shop_list_view(self, client):
        url = reverse('shop-list')
        response = client.get(url)
        assert response.status_code in [200, 204]  

    def test_shop_detail_view(self, client):
        url = reverse('shop-detail', kwargs={'pk': 1})
        response = client.get(url)
        assert response.status_code in [200, 404]

    def test_product_detail_view(self, client):
        url = reverse('product-detail', kwargs={'pk': 1})
        response = client.get(url)
        assert response.status_code in [200, 404]


    # تستی که نیاز به Store داره:
    def test_product_list_view(self, client):
        user = User.objects.create(email='testmanager@gmail.com', password='mmd12345')
        manager = Manager.objects.create(user=user, first_name='test', last_name='this is')
        store = Store.objects.create(manager=manager, name="Test Store", description='this is test store')

        url = reverse('product-list', kwargs={'pk': store.pk})
        response = client.get(url)

        assert response.status_code in [200, 204]  # بسته به view تو
