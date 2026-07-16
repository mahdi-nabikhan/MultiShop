from rest_framework import serializers

from ...models import Conversation ,Message


class ConversationCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Conversation
        fields = ("id", "store")
        read_only_fields = ("id",)
        
        



class MessageCreateSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Message
        fields = (
            "text",
            "image",
            "file",
            "reply_to",
        )

    def validate(self, attrs):
        text = attrs.get("text")
        image = attrs.get("image")
        file = attrs.get("file")
        reply_to = attrs.get("reply_to")

        if not text and not image and not file:
            raise serializers.ValidationError(
                "At least one of text, image or file is required."
            )

        conversation = self.context.get("conversation")

        if conversation and reply_to:
            if reply_to.conversation != conversation:
                raise serializers.ValidationError(
                    {"reply_to": "This message does not belong to this conversation."}
                )

        return attrs