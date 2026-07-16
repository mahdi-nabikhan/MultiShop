import pytest

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from account.models import User
from vendor.models import Manager, Store
from dashboard.models import Conversation


@pytest.mark.django_db
class TestCreateConversationAPIView:

    def setup_method(self):
        self.client = APIClient()

        self.customer = User.objects.create_user(
            email="customer@test.com",
            password="12345678",
        )

        manager_user = User.objects.create_user(
            email="manager@test.com",
            password="12345678",
        )

        manager = Manager.objects.create(
            user=manager_user,
        )

        self.store = Store.objects.create(
            manager=manager,
            name="Apple Store",
            description="Test Store",
        )

    def test_create_conversation(self):

        self.client.force_authenticate(self.customer)

        url = reverse("api/v1:create_conversation")

        response = self.client.post(
            url,
            {
                "store": self.store.id,
            },
            format="json",
        )

        assert response.status_code == status.HTTP_201_CREATED
        assert Conversation.objects.count() == 1

    def test_duplicate_conversation(self):

        Conversation.objects.create(
            customer=self.customer,
            store=self.store,
        )

        self.client.force_authenticate(self.customer)

        url = reverse("api/v1:create_conversation")

        response = self.client.post(
            url,
            {
                "store": self.store.id,
            },
            format="json",
        )

        assert response.status_code == status.HTTP_200_OK
        assert Conversation.objects.count() == 1