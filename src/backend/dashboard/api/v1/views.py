from rest_framework import status
from rest_framework.generics import GenericAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ...models import Conversation
from .serializers import ConversationCreateSerializer


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