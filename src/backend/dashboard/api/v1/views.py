from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.generics import GenericAPIView, get_object_or_404
from ...models import Conversation
from .serializers import ConversationCreateSerializer,MessageCreateSerializer


class CreateConversationApiView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ConversationCreateSerializer

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        store = serializer.validated_data["store"]

        conversation, created = Conversation.objects.get_or_create(
            customer=request.user,
            store=store,
            defaults={
                "status": Conversation.Status.OPEN,
            },
        )

        return Response(
            {
                "conversation_id": conversation.id,
                "created": created,
            },
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )
        




class CreateMessageAPIView(GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = MessageCreateSerializer

    def post(self, request, conversation_id):
        conversation = get_object_or_404(
            Conversation,
            pk=conversation_id
        )

        if request.user != conversation.customer:
            if request.user not in (
                conversation.store.owner,
                conversation.store.manager,
            ):
                return Response(
                    {"detail": "You don't have permission to send messages."},
                    status=status.HTTP_403_FORBIDDEN,
                )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

      
        reply_to = serializer.validated_data.get("reply_to")

        if reply_to and reply_to.conversation != conversation:
            return Response(
                {"detail": "Invalid reply message."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        message = serializer.save(
            conversation=conversation,
            sender=request.user,
        )

        return Response(
            {
                "id": message.id,
                "conversation": conversation.id,
                "sender": request.user.id,
                "text": message.text,
                "image": message.image.url if message.image else None,
                "file": message.file.url if message.file else None,
                "created_at": message.created_at,
            },
            status=status.HTTP_201_CREATED,
        )