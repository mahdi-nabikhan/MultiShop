from django.urls import path, include
from .views import *

app_name = 'account'
urlpatterns = [
    path('api/v1/', include('account.api.v1.urls')),
    path('login/',LoginView.as_view(),name='login'),
    path('login/jwt/',JwtLogin.as_view(),name='jwt_login')

]
