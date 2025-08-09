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
            customer = serializer.save()
            user=customer.user
            Token.objects.create(user=user)
            return Response({'user': user.email, 'massage': 'customer successfully registered'},
                            status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddAddressApiView(GenericAPIView):
    serializer_class = AddressSerializer
    model = Address

    def get_queryset(self):
        return self.model.objects.filter(customer__pk=self.request.user.pk)

    def get(self, request):
        address_list = self.get_queryset()
        serializer = self.serializer_class(address_list, many=True, context={'request': request})
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data
        serializer = self.serializer_class(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({'massage': 'address successfully add'}, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DetailAddressApiView(GenericAPIView):
    serializer_class = AddressSerializer
    model = Address

    def get(self, request, pk):
        obj = self.model.objects.get(pk=pk)
        serializer = AddressSerializer(obj)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        obj = self.model.objects.get(pk=pk)
        data = request.data
        serializer = self.serializer_class(data=data, instance=obj)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        obj = self.model.objects.get(pk=pk)
        data = request.data
        serializer = self.serializer_class(data=data, instance=obj, initial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        obj = self.model.objects.get(pk=pk)
        obj.delete()
        return Response({'massage': 'address successfully deleted'})
