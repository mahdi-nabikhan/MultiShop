from rest_framework import serializers
from vendor.models import *
from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import ValidationError

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
    store = StoreSerializer()
    address = StoreAddressSerializer(write_only=True)
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = Manager
        fields = ['email', 'password', 'password2', 'store', 'address']

    def validate(self, data):
        password = data['password']
        password2 = data['password2']
        if password != password2:
            msg = 'passwords do not match'
            raise ValidationError(msg, code='password')
        try:
            validate_password(password)
        except ValidationError as e:
            raise ValidationError(e)
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        store = validated_data.pop('store')
        address = validated_data.pop('address')
        manager = Manager.objects.create_user(**validated_data)
        store = Store.objects.create(manager=manager, **store)
        ShopAddress.objects.create(store=store, **address)
        return manager
