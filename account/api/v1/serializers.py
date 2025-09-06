from django.contrib.auth import authenticate
from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from account.models import *
from rest_framework import serializers, validators
from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import ValidationError
from django.contrib.auth import login
from django.contrib.auth.password_validation import validate_password


class LoginSerializer(serializers.Serializer):
    email = serializers.CharField(label=_("Email"), write_only=True)
    password = serializers.CharField(
        label=_("Password"),
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True
    )

    def validate(self, attrs):
        email = attrs['email']
        password = attrs['password']
        if email and password:
            user = authenticate(request=self.context.get('request'), username=email, password=password)
            if not user:
                if not user:
                    msg = _('Unable to log in with provided credentials.')
                    raise serializers.ValidationError()
        else:
            msg = _('Must include "email" and "password".')
            raise serializers.ValidationError({'non_field_errors': [msg]})
        attrs['user'] = user

        return attrs


class UserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'password2']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, attrs):

        password1 = attrs.get('password')
        password2 = attrs.get('password2')
        if password1 != password2:
            msg = _('password most be match')
            raise serializers.ValidationError(msg, code='invalid password')
        try:
            validate_password(password1)
        except ValidationError as e:
            raise serializers.ValidationError(e)
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        return User.objects.create_user(**validated_data)


class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "email"]
