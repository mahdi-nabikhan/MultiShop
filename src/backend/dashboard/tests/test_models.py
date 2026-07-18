import pytest

from account.models import User
from dashboard.models import Conversation, Message,Ticket,ReplayTicket
from vendor.models import Manager, Store
from customer.models import Customer
from account.models import User


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
        
        
        
@pytest.fixture
def customer(db):
    user =  User.object.create(
            email='test1234@gmail.com',
            password = 'test12345'
        )
    customer = Customer.object.create (username='testusername',user=user)
    return customer
@pytest.fixture
def store(db):
    user_manager = User.objects.create(email= 'manager@gmail.com', passwod= 'test12345')
    manager = Manager.objects.create(
             user=user_manager,
             first_name='test',
             last_name = 'test'
        )
    store = Store.objects.create(
            manager=manager,
            name="Apple Store",
            description="Test Store",
        )
    return store
    


            

@pytest.mark.django_db
class TestTickentModel:
    
    def test_create_ticket (self):
       
        

        
        
        ticket = Ticket.objects.create(
            title = 'Problem with Product',
            content = 'i have problem',
            customer= customer,
            store = store
        )
        
        assert ticket.title == 'Problem with Product'
        assert ticket.content == 'i have problem'
        
        
    def test_ticket_created_at_auto_set(self):
        
        ticket = Ticket.objects.create(
            title = 'Problem with Product',
            content = 'i have problem',
            customer= customer,
            store = store
        )
         
         
        assert ticket.created_at is not None
        assert ticket.updated_at is not None
        
    def test_customer_ticket_related_name (self):
        ticket = Ticket.objects.create(
            title = 'Problem with Product',
            content = 'i have problem',
            customer= customer,
            store = store
        )
        
        assert ticket.customer_ticket.count()



@pytest.mark.django_db
class TestReplayTicketModel:
    def test_create_replay_ticket(self):
        ticket = Ticket.objects.create(
            title = 'Problem with Product',
            content = 'i have problem',
            customer= customer,
            store = store
        )
        reply = ReplayTicket.objects.create(content='this is test for create',replay_ticket = ticket)
        assert reply.content == 'this is test for create'
        assert reply.replay_ticket == ticket
    
    def test_delete_ticket_delete_replay(self):
        ticket = Ticket.objects.create(
            title = 'Problem with Product',
            content = 'i have problem',
            customer= customer,
            store = store
        )
        reply = ReplayTicket.objects.create(content='this is test for create',replay_ticket = ticket)
        
        ticket.delete()
        assert ReplayTicket.objects.count() == 0