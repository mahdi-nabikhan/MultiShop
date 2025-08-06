from rest_framework import serializers, validators
from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import ValidationError
from account.api.v1 import serializers as account_serializers
from customer.models import *
from django.contrib.auth.password_validation import validate_password
from account.api.v1.serializers import *


class CustomerRegisterSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField()

    class Meta:
        model = Customer
        fields = ['email', 'password', 'password2']
        write_only_fields = ['password', 'password2']

    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        if password != password2:
            msg = _('password most be match')
            raise serializers.ValidationError(msg, code='invalid password')
        try:
            validate_password(password)
        except ValidationError as e:
            raise serializers.ValidationError(e)
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        return Customer.objects.create_user(**validated_data)


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['email', 'username']


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['state', 'state', 'city', 'postal_code', 'customer']
        read_only_fields = ['customer']

    def create(self, validated_data):
        validated_data['customer'] = Customer.objects.get(pk=self.context.get('request').user.pk)
        return super().create(validated_data)

    def to_representation(self, instance):
        res = super().to_representation(instance)

        res['customer'] = CustomerSerializer(instance.customer).data
        return res
