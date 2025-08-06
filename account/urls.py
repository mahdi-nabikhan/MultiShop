from django.urls import path, include
from .views import *

app_name = 'account'
urlpatterns = [
    path('api/v1/', include('account.api.v1.urls'))

]
