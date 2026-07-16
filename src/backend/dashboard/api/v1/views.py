from rest_framework import status
from rest_framework.generics import GenericAPIView, get_object_or_404
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from ...models import Conversation,Ticket
from ...services import can_access_conversation
from .serializers import (
    ConversationCreateSerializer,
    MessageCreateSerializer,
    MessageSerializer,
    ListCreateTicketSerializers
)


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
            pk=conversation_id,
        )

        if not can_access_conversation(request.user, conversation):
            return Response(
                {
                    "detail": "You don't have permission to send messages."
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = self.get_serializer(
            data=request.data,
            context={
                "conversation": conversation,
            },
        )

        serializer.is_valid(raise_exception=True)

        message = serializer.save(
            conversation=conversation,
            sender=request.user,
        )

        return Response(
            MessageSerializer(message).data,
            status=status.HTTP_201_CREATED,
        )
        
        
class CreateAndListTicketAPIView(GenericAPIView):
    serializer_class = ListCreateTicketSerializers
    
    
    def get (self,request,pk):
        obj =Ticket.objects.filter(customer__user= request.user)
        serializer = self.serializer_class(instance = obj,many = True,context = {'request':request,'pk':pk})
        return Response(serializer.data,status=status.HTTP_200_OK)
    
    def post (self,request,pk):
        data = request.data 
        serializer =  self.serializer_class(data=data,context = {'request':request,'pk':pk})
        if serializer.is_valid():
            serializer.save()
            return  Response(serializer.data,status=status.HTTP_200_OK)
        else:
            return  Response(serializer.errors,status=status.HTTP_404_NOT_FOUND) 