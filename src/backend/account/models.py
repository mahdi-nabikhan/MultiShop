from django.contrib.auth.base_user import BaseUserManager
from django.db import models
from django.contrib.auth.models import AbstractBaseUser, Permission, PermissionsMixin
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.db import models
from datetime import timedelta

from django.utils import timezone
import uuid


class UserManager(BaseUserManager):
    """
    custom user model manager where email  are the unique
    for authentication instead of usernames.
    """

    def create_user(self, email, password=None, **extra_fields):
        """
        create and save a user with the given email and password.
        """
        if not email:
            raise ValueError('Users must have an email address')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)

        user.save()
        return user

    def create_superuser(self, email, password, **extra_fields):
        """
        create and save a superuser with the given email and password.
        """
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')
        return self.create_user(email, password, **extra_fields)


# Create your models here.
class User(AbstractBaseUser, PermissionsMixin):
    """
    Custom user model that supports using email instead of username.
    """
    email = models.EmailField(max_length=255, unique=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False,null=True,blank=True)
    is_superuser = models.BooleanField(default=False)

    USERNAME_FIELD = 'email'

    created_date = models.DateTimeField(auto_now_add=True,null=True,blank=True)
    updated_date = models.DateTimeField(auto_now=True)

    objects = UserManager()

    def __str__(self):
        return self.email



class PasswordResetCode(models.Model):
    """
    Model for storing time-limited password reset verification codes.

    This model represents a one-time password reset code associated with a user.
    Each code is generated during the password reset flow and is valid only for
    a short, predefined duration to enhance security.

    Fields:
        user (ForeignKey):
            - Reference to the related User.
            - Cascade deletion ensures cleanup when a user is removed.

        code (CharField):
            - 6-digit verification code.
            - Used to confirm password reset requests.

        created_at (DateTimeField):
            - Timestamp indicating when the reset code was created.
            - Automatically set at creation time.

    Methods:
        is_expired() -> bool:
            Determines whether the reset code has expired.

            Returns:
                True  – if the code is older than the allowed time window.
                False – if the code is still valid.

    Expiration Policy:
        - Reset codes are valid for 5 minutes from creation time.
        - Expired codes must not be accepted for authentication or password reset.

    Security Considerations:
        - Codes should ideally be invalidated or deleted after successful use.
        - Multiple active codes per user should be avoided or handled carefully
          to prevent replay attacks.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        return self.created_at + timedelta(minutes=5) < timezone.now()