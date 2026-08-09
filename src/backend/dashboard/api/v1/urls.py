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
    path(
        "conversations/<int:conversation_id>/messages/list/",
        ConversationMessagesAPIView.as_view(),
        name="conversation-message-list",
    ),
    path('create/list/ticket/<int:pk>/',CreateAndListTicketAPIView.as_view(),name='create_list_ticket'),
    path('detail/ticket/<int:pk>/',DetailTicketApiView.as_view(),name='ticket_detail'),
    path('replay/ticket/<int:pk>/',CreateAndListReplayTicketAPIView.as_view(),name='replay-tiket'),
    path('detail/replay/ticket/<int:pk>/',DetailReplayTicketAPIView.as_view(),name='detail-ticket-detail'),
    path('shop/all/ticket/',GetShopTicketAPIView.as_view(),name='shop-get-all-ticket'),
    path('customer/list/ticket/',CustomerListTicketApiView.as_view(),name='customer-ticket'),
    path('list/store/conversations/',ListConversationStoreAPIView.as_view(),name='list-store-conversation'),
    path('list/customer/conversation/',ListConversationCustomerApiView.as_view(),name='list-cutsomer-converstion')
    

]
