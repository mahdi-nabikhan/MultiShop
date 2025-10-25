from rest_framework import serializers, validators
from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import ValidationError
from account.api.v1.serializers import UserSerializer
import order.models
from account.api.v1 import serializers as account_serializers
from customer.models import *
from django.contrib.auth.password_validation import validate_password
from account.api.v1.serializers import *
from order.models import *


class CustomerRegisterSerializer(serializers.ModelSerializer):
    user = UserSerializer(write_only=True)

    class Meta:
        model = Customer
        fields = ['username', 'user']

    def create(self, validated_data):
        user_data = validated_data.pop('user')

        user_serializer = UserSerializer(data=user_data, context=self.context)
        user_serializer.is_valid(raise_exception=True)
        user = user_serializer.save()

        customer = Customer.objects.create(user=user, **validated_data)
        return customer


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['username']


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id','state', 'state', 'city', 'postal_code', 'customer']
        read_only_fields = ['customer','id']

    def create(self, validated_data):
        validated_data['customer'] = Customer.objects.get(user_id=self.context.get('request').user.id)
        return super().create(validated_data)

    def to_representation(self, instance):
        res = super().to_representation(instance)

        res['customer'] = CustomerSerializer(instance.customer).data
        return res


class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comments
        fields = '__all__'
        read_only_fields = ['user','product','status']

    def create(self, validated_data):
        validated_data['user'] = Customer.objects.get(user_id=self.context.get('request').user.id)
        validated_data['product'] = self.context.get('product')
        return super().create(validated_data)
    
    def to_representation(self, instance):
        rep=super().to_representation(instance)
        rep['user']=UsersSerializer(instance.user.user).data
        return rep
    
class ProductRateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductRate
        fields = '__all__'
        read_only_fields = ['product']

    def validate(self, attrs):
        request = self.context.get('request')
        customer = Customer.objects.get(user=request.user)
        product = Product.objects.get(pk=self.context.get('pk'))


        if not OrderItem.objects.filter(order__customer=customer, product=product).exists():
            raise serializers.ValidationError("You can rate only purchased products!")

        return attrs

    def create(self, validated_data):
        validated_data['product'] = Product.objects.get(pk=self.context.get('pk'))
        return ProductRate.objects.create(**validated_data)



class CustomerDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model=Customer
        fields='__all__'
        read_only_fields=['user']
        
        
        