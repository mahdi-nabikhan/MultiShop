from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework import status
from .serializers import *
from rest_framework.authtoken.models import Token


class ManagerRegisterAPIView(GenericAPIView):
    serializer_class = ManagerSerializer
    queryset = Manager.objects.all()

    def post(self, request):
        data = request.data
        serializer = self.serializer_class(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminRegisterAPIView(GenericAPIView):
    serializer_class = AdminsSerializer

    def post(self, request):
        data = request.data
        serializer = self.serializer_class(data=data, context={'request': request})
        if serializer.is_valid():
            user = serializer.save()
            Token.objects.create(user=user)
            return Response(
                {'email': serializer.validated_data.get('email'), 'massage': 'admin successfully registered'},
                status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
