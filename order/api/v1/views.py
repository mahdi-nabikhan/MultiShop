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


class OrderItemListAPIView(generics.GenericAPIView):
    serializer_class = OrderItemSerializer
    queryset = OrderItem.objects.all()

    def get(self, request, pk):
        obj = self.queryset.filter(order__pk=pk)
        serializer = self.serializer_class(obj, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class OrderItemDetailView(generics.GenericAPIView):
    serializer_class = OrderItemSerializer
    queryset = OrderItem.objects.all()

    def get(self, request, pk):
        obj = self.queryset.get(pk=pk)
        serializer = self.serializer_class(obj)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        data = request.data
        obj = self.queryset.get(pk=pk)
        serializer = self.serializer_class(data=data, instance=obj)
        if serializer.is_valid():
            
            serializer.save(total=obj.product.price * obj.quantity)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)

    def patch(self, request, pk):
        data = request.data
        obj = self.queryset.get(pk=pk)
        serializer = self.serializer_class(data=data, instance=obj, partial=True)
        if serializer.is_valid():
            
            serializer.save(total=obj.product.price * obj.quantity)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, pk):
        self.queryset.get(pk=pk).delete()
        return Response({'details': 'object deleted successfully'}, status=status.HTTP_204_NO_CONTENT)


class ShopOrderListApiView(generics.GenericAPIView):
    serializer_class = OrderItemSerializer
    
    def get_queryset(self):
        return OrderItem.objects.filter(product__store__manager__user=self.request.user)

    def get(self,request):
        obj=self.get_queryset()
        serializer=self.serializer_class(obj,many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
        