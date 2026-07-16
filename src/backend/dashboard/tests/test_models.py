import pytest

from account.models import User
from dashboard.models import Conversation, Message
from vendor.models import Manager, Store


@pytest.mark.django_db
class TestConversationModel:

    def test_create_conversation(self):

        customer = User.objects.create_user(
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

        store = Store.objects.create(
            manager=manager,
            name="Apple Store",
            description="Test Store",
        )

        conversation = Conversation.objects.create(
            customer=customer,
            store=store,
        )

        assert conversation.customer == customer
        assert conversation.store == store
        assert conversation.status == Conversation.Status.OPEN


@pytest.mark.django_db
class TestMessageModel:

    def test_create_message(self):

        customer = User.objects.create_user(
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

        store = Store.objects.create(
            manager=manager,
            name="Apple Store",
            description="Test Store",
        )

        conversation = Conversation.objects.create(
            customer=customer,
            store=store,
        )

        message = Message.objects.create(
            conversation=conversation,
            sender=customer,
            text="Hello",
        )

        assert message.sender == customer
        assert message.conversation == conversation
        assert message.text == "Hello"
        assert message.is_read is False
        assert message.is_deleted is False
        assert message.is_edited is False

    def test_reply_message(self):

        customer = User.objects.create_user(
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

        store = Store.objects.create(
            manager=manager,
            name="Apple Store",
            description="Test Store",
        )

        conversation = Conversation.objects.create(
            customer=customer,
            store=store,
        )

        first = Message.objects.create(
            conversation=conversation,
            sender=customer,
            text="First Message",
        )

        reply = Message.objects.create(
            conversation=conversation,
            sender=customer,
            text="Reply Message",
            reply_to=first,
        )

        assert reply.reply_to == first

    def test_message_ordering(self):

        customer = User.objects.create_user(
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

        store = Store.objects.create(
            manager=manager,
            name="Apple Store",
            description="Test Store",
        )

        conversation = Conversation.objects.create(
            customer=customer,
            store=store,
        )

        first = Message.objects.create(
            conversation=conversation,
            sender=customer,
            text="First",
        )

        second = Message.objects.create(
            conversation=conversation,
            sender=customer,
            text="Second",
        )

        messages = Message.objects.all()

        assert messages[0] == first
        assert messages[1] == second