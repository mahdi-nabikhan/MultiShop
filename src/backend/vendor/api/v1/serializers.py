from rest_framework import serializers
from vendor.models import *
from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import ValidationError
from website.models import *
from customer.models import *
from django.contrib.auth.password_validation import validate_password
from account.api.v1.serializers import *
from website.models import *
from order.models import OrderItem,Order
from customer.api.v1.serializers import CustomerDetailSerializer


class StoreAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopAddress
        fields = ['state', 'street']


class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = ['pk','image', 'description', 'name']


class ManagerSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    store = StoreSerializer()
    address = StoreAddressSerializer(write_only=True)

    class Meta:
        model = Manager
        fields = ['user', 'store', 'address', 'first_name', 'last_name']

    def create(self, validated_data):
        user_data = validated_data.pop('user')

        user_serializer = UserSerializer(data=user_data, context=self.context)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()

        store_data = validated_data.pop('store')
        address_data = validated_data.pop('address')

        manager = Manager.objects.create(user=user, **validated_data)
        store = Store.objects.create(manager=manager, **store_data)
        ShopAddress.objects.create(store=store, **address_data)

        return manager


class AdminsSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Admin
        fields = ['username', 'user']

    def create(self, validated_data):
        user_data = validated_data.pop('user')

        user_serializer = UserSerializer(data=user_data, context=self.context)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()

        manager = Manager.objects.get(user_id=self.context['request'].user.id)
        store = Store.objects.get(manager=manager)
        return Admin.objects.create(shop=store, user=user)


class OperatorSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = Operator
        fields = ['username', 'user']

    def create(self, validated_data):
        user_data = validated_data.pop('user')

        user_serializer = UserSerializer(data=user_data, context=self.context)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()

        manager = Manager.objects.get(user_id=self.context['request'].user.id)
        store = Store.objects.get(manager=manager)
        return Operator.objects.create(shop=store, user=user)


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['store', 'pk']

    def create(self, validated_data):
        user = self.context.get('request').user
        manager = Manager.objects.filter(user=user).exists()
        admin = Admin.objects.filter(user=user).exists()
        if manager:
            store = Store.objects.get(manager__user=user)
            product = Product.objects.create(store=store, **validated_data)
            return product
        elif admin:
            store = Store.objects.get(admin__user=user)
            return Product.objects.create(store=store, **validated_data)
        else:
            raise ValidationError()


class AddImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImages
        fields = "__all__"
        read_only_fields = ['title', 'description']

    def to_representation(self, instance):
        rep = super().to_representation(instance)
        rep['product'] = ProductSerializer(instance.product).data
        return rep

    def create(self, validated_data):
        pk = self.context.get('pk')
        validated_data['product'] = Product.objects.get(pk=pk)
        return ProductImages.objects.create(**validated_data)


class AddDiscountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Discount
        fields = ['pk','id','products', 'value', 'discount_type']
        read_only_fields = ('pk','id','products',)

    def create(self, validated_data):
        
    
        pk = self.context.get("pk")
        product = Product.objects.get(pk=pk)
        if validated_data["discount_type"] == "cash":
            product.price_after = max(
                product.price - validated_data["value"],0)
        elif validated_data["discount_type"] == "percentage":
            product.price_after = max(
                int(product.price * (1 - validated_data["value"] / 100)))
        product.save()
        validated_data["products"] = product
        return Discount.objects.create(**validated_data)

class OrderItemUpdateStatusSerializer(serializers.ModelSerializer):
    class Meta :
        model=OrderItem
        fields=['pk','status','product']
        read_only_fields=['product']
            
    def to_representation(self, instance):
        response=super().to_representation(instance)
        response['product']=ProductSerializer(instance.product).data
        return response
    
        
class ListOrderSerialazers(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['pk','status','customer']
        
        
    def to_representation(self, instance):
        res =  super().to_representation(instance)
        res['customer'] = CustomerDetailSerializer(instance.customer).data
        return res
    
    
