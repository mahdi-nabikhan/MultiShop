from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework import status
from .serializers import *
from rest_framework.authtoken.models import Token


class CustomerRegisterApiView(GenericAPIView):
    serializer_class = CustomerRegisterSerializer

    def post(self, request):
        data = request.data
        serializer = self.serializer_class(data=data)
        if serializer.is_valid():
            user = serializer.save()
            Token.objects.create(user=user)
            return Response({'user': user.email, 'massage': 'customer successfully registered'},
                            status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
