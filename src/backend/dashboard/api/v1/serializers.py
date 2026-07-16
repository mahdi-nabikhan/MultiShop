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

        if not text and not image and not file:
            raise serializers.ValidationError(
                "At least one of text, image or file is required."
            )

        return attrs