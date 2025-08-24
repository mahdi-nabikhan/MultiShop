from rest_framework.response import Response
from rest_framework import generics, status
from .serializer import *


class OrderListApiView(generics.GenericAPIView):
    model = Order
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(customer__user=self.request.user)

    def get(self, request):
        queryset = self.get_queryset()
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class OrderItemCreateApiView(generics.GenericAPIView):
    serializer_class = OrderItemSerializer

    def post(self, request, pk):
        serializer = self.serializer_class(data=request.data, context={'request': request, 'pk': pk})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
