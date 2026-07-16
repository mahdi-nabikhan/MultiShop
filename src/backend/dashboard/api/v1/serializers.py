from rest_framework import serializers
from customer.models import Customer
from ...models import Conversation ,Message,Ticket,ReplayTicket
from vendor.models import Store
from customer.api.v1.serializers import CustomerDetailSerializer

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


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.CharField(source="sender.email", read_only=True)

    class Meta:
        model = Message
        fields = (
            "id",
            "conversation",
            "sender",
            "text",
            "image",
            "file",
            "reply_to",
            "is_read",
            "is_edited",
            "is_deleted",
            "created_at",
            "edited_at",
        )
        
class ListCreateTicketSerializers(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = ('pk','title','content','store','customer')
        read_only_fields =('customer,store')
        
    def create(self, validated_data):
        request= self.context.get('request')
        pk=self.context.get('pk')
        validated_data ['customer'] = Customer.objects.get(user=request.user)
        validated_data['store'] = Store.objects.get(pk=pk)
        return Ticket.objects.create(**validated_data)
    def to_representation(self, instance):
        res =  super().to_representation(instance)
        res ['customer'] = CustomerDetailSerializer(res.customer).data
        return res
    
    
class DetailTicketSerializer(serializers.ModelSerializer):
    class Meta :
        model=Ticket
        fields = ('pk','title','content','store','customer')
        read_only_fields =('customer,store')
        
    def to_representation(self, instance):
        res =  super().to_representation(instance)
        res ['customer'] = CustomerDetailSerializer(res.customer).data
        return res
    
    