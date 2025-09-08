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
            manager = serializer.save()
            Token.objects.create(user=manager.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AdminRegisterAPIView(GenericAPIView):
    serializer_class = AdminsSerializer

    def post(self, request):
        data = request.data
        serializer = self.serializer_class(data=data, context={'request': request})
        if serializer.is_valid():
            admin = serializer.save()
            Token.objects.create(user=admin.user)
            return Response(
                {'email': serializer.validated_data.get('email'), 'massage': 'admin successfully registered'},
                status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AddProductAPIView(GenericAPIView):
    serializer_class = ProductSerializer
    model = Product

    def get_queryset(self):
        my_manager = Manager.objects.filter(user=self.request.user).exists()
        my_admin = Admin.objects.filter(user=self.request.user).exists()
        if my_manager:
            obj = self.model.objects.filter(store__manager__user=self.request.user)
            return obj
        elif my_admin:
            obj = self.model.objects.filter(store__admin__user=self.request.user)
            return obj
        else:
            return Response('no such user', status=status.HTTP_404_NOT_FOUND)

    def get(self, request):
        obj = self.get_queryset()
        serializer = self.serializer_class(obj, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        data = request.data
        serializer = self.serializer_class(data=data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProductDetailAPIView(GenericAPIView):
    serializer_class = ProductSerializer
    queryset = Product.objects.all()
    model = Product

    def get(self, request, pk):
        obj = self.model.objects.get(pk=pk)
        serializer = self.serializer_class(obj)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        obj = self.model.objects.get(pk=pk)
        data = request.data
        serializer = self.serializer_class(instance=obj, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        data = request.data
        obj = self.model.objects.get(pk=pk)
        serializer = self.serializer_class(obj, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        obj = self.model.objects.get(pk=pk)
        obj.delete()
        return Response({'massage': 'your product successfully deleted'}, status=status.HTTP_204_NO_CONTENT)


class StoreUpdateApiView(GenericAPIView):
    serializer_class = StoreSerializer

    def get_queryset(self):
        store = Store.objects.get(manager__user=self.request.user)
        return store

    def put(self, request):
        data = request.data
        store = self.get_queryset()
        serializer = self.serializer_class(instance=store, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        data = request.data
        store = self.get_queryset()
        serializer = self.serializer_class(instance=store, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AllProductShopApiView(GenericAPIView):
    serializer_class = ProductSerializer
    model = Product

    def get_queryset(self):
        if Store.objects.filter(manager__user=self.request.user).exists():
            print('this is you products -----------------------------',self.model.objects.filter(store__manager__user=self.request.user))
            return self.model.objects.filter(store__manager__user=self.request.user)
        elif Store.objects.filter(admin__user=self.request.user).exists():
            return self.model.objects.filter(store__admin__user=self.request.user)
        else:
            return {'not found'}

    def get(self, request):
        obj = self.get_queryset()
        serializer = self.serializer_class(obj, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
