from rest_framework import serializers
from vendor.models import *
from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import ValidationError
from website.models import *
from customer.models import *
from django.contrib.auth.password_validation import validate_password
from account.api.v1.serializers import *


class StoreAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShopAddress
        fields = ['state', 'street']


class StoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Store
        fields = ['image', 'description', 'name']


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


class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = '__all__'
        read_only_fields = ['store','pk']

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
