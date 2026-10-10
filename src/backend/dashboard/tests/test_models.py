
import pytest

from account.models import User
from customer.models import Customer
from dashboard.models import (
    Conversation,
    Message,
    Ticket,
    ReplayTicket,
)
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

        manager = Manager.objects.create(user=manager_user)

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

        manager = Manager.objects.create(user=manager_user)

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

        manager = Manager.objects.create(user=manager_user)

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

        manager = Manager.objects.create(user=manager_user)

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

        messages = list(Message.objects.filter(conversation=conversation))

        assert messages[0] == first
        assert messages[1] == second


@pytest.fixture
def customer(db):
    user = User.objects.create_user(
        email="test1234@gmail.com",
        password="test12345",
    )

    return Customer.objects.create(
        username="testusername",
        user=user,
    )


@pytest.fixture
def store(db):
    user_manager = User.objects.create_user(
        email="manager@gmail.com",
        password="test12345",
    )

    manager = Manager.objects.create(
        user=user_manager,
        first_name="test",
        last_name="test",
    )

    return Store.objects.create(
        manager=manager,
        name="Apple Store",
        description="Test Store",
    )


@pytest.mark.django_db
class TestTickentModel:

    def test_create_ticket(self, customer, store):
        ticket = Ticket.objects.create(
            title="Problem with Product",
            content="i have problem",
            customer=customer,
            store=store,
        )

        assert ticket.title == "Problem with Product"
        assert ticket.content == "i have problem"
        assert ticket.customer == customer
        assert ticket.store == store

    def test_ticket_created_at_auto_set(self, customer, store):
        ticket = Ticket.objects.create(
            title="Problem with Product",
            content="i have problem",
            customer=customer,
            store=store,
        )

        assert ticket.created_at is not None
        assert ticket.updated_at is not None

    def test_customer_ticket_related_name(self, customer, store):
        Ticket.objects.create(
            title="Problem with Product",
            content="i have problem",
            customer=customer,
            store=store,
        )

        assert customer.customer_ticket.count() == 1


@pytest.mark.django_db
class TestReplayTicketModel:

    def test_create_replay_ticket(self, customer, store):
        ticket = Ticket.objects.create(
            title="Problem with Product",
            content="i have problem",
            customer=customer,
            store=store,
        )

        reply = ReplayTicket.objects.create(
            content="this is test for create",
            replay_ticket=ticket,
        )

        assert reply.content == "this is test for create"
        assert reply.replay_ticket == ticket

    def test_delete_ticket_delete_replay(self, customer, store):
        ticket = Ticket.objects.create(
            title="Problem with Product",
            content="i have problem",
            customer=customer,
            store=store,
        )

        ReplayTicket.objects.create(
            content="this is test for create",
            replay_ticket=ticket,
        )

        ticket.delete()

        assert ReplayTicket.objects.count() == 0

