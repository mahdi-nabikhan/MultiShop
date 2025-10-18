from django.urls import path
from .views import *

app_name = 'api/v1'
urlpatterns = [
    path('login/', CustomObtainAuthToken.as_view(), name='login'),
    path('profile/',ProfileApiView.as_view(), name='profile'),
    path('logout/', LogOutApiView.as_view(), name='logout'),
    path('jwt/token/login/',CustomeObtainPairView.as_view(),name='jwt_login'),
    path('change/password/',ChangePasswordView.as_view(),name='change-password')


]
