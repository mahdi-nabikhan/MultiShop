import pytest

from account.models import User
from vendor.models import Manager, Store
from dashboard.models import Conversation, Message
from dashboard.api.v1.serializers import (
    ConversationCreateSerializer,
    MessageCreateSerializer,
    MessageSerializer,
)


@pytest.mark.django_db
class TestConversationCreateSerializer:

    def setup_method(self):
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

    def test_serializer_valid_data(self):
        serializer = ConversationCreateSerializer(
            data={
                "store": self.store.id,
            }
        )

        assert serializer.is_valid()
        assert serializer.validated_data["store"] == self.store