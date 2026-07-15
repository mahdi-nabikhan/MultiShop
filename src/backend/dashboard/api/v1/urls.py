from django.urls import path
from .views import *

app_name = 'api/v1'
urlpatterns = [
   path('chat/conversations/',CreateConversationApiView.as_view(),name='create_conversation')

]