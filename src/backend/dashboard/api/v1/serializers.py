from rest_framework import serializers

from ...models import Conversation


class ConversationCreateSerializer(serializers.ModelSerializer):

    class Meta:
        model = Conversation
        fields = ("id", "store")
        read_only_fields = ("id",)