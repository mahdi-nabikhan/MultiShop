from django.contrib.auth import authenticate
from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from account.models import *


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
    class Meta:
        model = User
        fields = ['email', 'created_date']
