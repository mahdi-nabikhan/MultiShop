from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from .models import Conversation, Message
from vendor.models import (Manager, Operator, Admin)


class ChatConsumer(AsyncJsonWebsocketConsumer):

    async def connect(self):
        user = self.scope["user"]

        if user.is_anonymous:
            await self.close()
            return

        self.conversation_id = self.scope["url_route"]["kwargs"]["conversation_id"]
        self.room_group_name = f"conversation_{self.conversation_id}"

        conversation = await self.get_conversation()

        if conversation is None:
            await self.close()
            return

        if not await self.is_participant(conversation):
            await self.close()
            return

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )

        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name,
        )

    async def receive_json(self, content):

        text = content.get("text", "")
        reply_to = content.get("reply_to")

        message = await self.create_message(
            text=text,
            reply_to=reply_to,
        )

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat.message",
                "message": {
                    "id": message.id,
                    "text": message.text,
                    "sender": message.sender.id,
                    "conversation": message.conversation.id,
                    "reply_to": message.reply_to_id,
                    "created_at": str(message.created_at),
                },
            },
        )

    async def chat_message(self, event):
        await self.send_json(event["message"])

    @database_sync_to_async
    def get_conversation(self):
        try:
            return Conversation.objects.get(pk=self.conversation_id)
        except Conversation.DoesNotExist:
            return None

    @database_sync_to_async
    def create_message(self, text, reply_to):

        conversation = Conversation.objects.get(pk=self.conversation_id)

        reply_message = None

        if reply_to:
            reply_message = Message.objects.filter(
                pk=reply_to,
                conversation=conversation,
            ).first()

        return Message.objects.create(
            conversation=conversation,
            sender=self.scope["user"],
            text=text,
            reply_to=reply_message,
        )
    @database_sync_to_async
    def is_participant(self, conversation):

        user = self.scope["user"]

        # Customer
        if conversation.customer == user:
            return True

        # Store Manager
        if conversation.store.manager.user == user:
            return True

        # Store Admin
        if Admin.objects.filter(
            user=user,
            shop=conversation.store
        ).exists():
            return True

        # Store Operator
        if Operator.objects.filter(
            user=user,
            shop=conversation.store
        ).exists():
            return True

        return False