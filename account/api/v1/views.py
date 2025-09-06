from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer
from customer.models import *
from vendor.models import *
from django.shortcuts import reverse
class CustomObtainAuthToken(ObtainAuthToken):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        data = request.data
        redirect_url=None
        serializer = self.serializer_class(data=data,context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data.get('user')
            token, create = Token.objects.get_or_create(user=user)
            if Customer.objects.filter(user=user).exists():
                redirect_url=reverse('shop-list')
            if Admin.objects.filter(user=user).exists():
                redirect_url=reverse('panel')
            if Manager.objects.filter(user=user).exists():
                redirect_url = reverse('panel')
            if Operator.objects.filter(user=user).exists():
                redirect_url = reverse('panel')

            return Response({'user-id': user.id, 'token': token.key,'redirect_url':redirect_url}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileApiView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UsersSerializer(request.user)
        print('user is',serializer.data)
        return Response(serializer.data)
