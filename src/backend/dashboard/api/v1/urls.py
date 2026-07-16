from django.urls import path
from .views import *

app_name = 'api/v1'
urlpatterns = [
    path('chat/conversations/', CreateConversationApiView.as_view(),
         name='create_conversation'),
    path(
        "conversations/<int:conversation_id>/messages/",
        CreateMessageAPIView.as_view(),
        name="create-message",
    ),
    path('create/list/ticket/<int:pk>/',CreateAndListTicketAPIView.as_view(),name='create_list_ticket')

]
