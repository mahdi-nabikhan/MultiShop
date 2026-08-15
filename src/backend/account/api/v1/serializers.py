from django.contrib.auth import authenticate
from rest_framework import serializers
from django.utils.translation import gettext_lazy as _
from account.models import *
from rest_framework import serializers, validators
from django.utils.translation import gettext_lazy as _
from rest_framework.exceptions import ValidationError
from django.contrib.auth import login
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from account.models import User


class LoginSerializer(serializers.Serializer):
    """
    Serializer for authenticating users using email and password credentials.

    ---
    **Purpose:**
        Validates login data by checking the provided `email` and `password`
        against Django’s authentication system.  
        On successful authentication, attaches the authenticated user instance
        to the validated data (`attrs['user']`).

    ### Fields:
        - `email` (CharField, write_only):
            User's email address used as the login identifier.
        - `password` (CharField, write_only):
            Plain-text password to be verified against the stored user credentials.

    ### Validation Logic:
        - Ensures both `email` and `password` are present.
        - Uses `django.contrib.auth.authenticate()` to verify credentials.
        - Raises `ValidationError` if:
            - Either field is missing, or
            - The credentials are invalid.

    ### Example Input:
        {
            "email": "user@example.com",
            "password": "strongpassword123"
        }

    ### Example Output (validated_data):
        {
            "email": "user@example.com",
            "user": <User instance>
        }

    ### Error Responses:
        - `{"non_field_errors": ["Must include 'email' and 'password'."]}`
        - `{"non_field_errors": ["Unable to log in with provided credentials."]}`

    ### Notes:
        - Relies on Django’s default authentication backend unless customized.
        - Returns a user instance, not a token — used by `CustomObtainAuthToken`
          or `CustomeObtainPairView` to generate tokens after validation.
        - The `request` context is required for authentication (passed by the calling view).

    Returns:
        dict: Validated attributes containing the authenticated user.
    """
    email = serializers.EmailField(label=_("Email"), write_only=True)
    password = serializers.CharField(
        label=_("Password"),
        style={'input_type': 'password'},
        trim_whitespace=False,
        write_only=True
    )

    def validate(self, attrs):
        email = attrs['email']
        password = attrs['password']
    
        user = authenticate(request=self.context.get('request'), username=email, password=password)
        if not user:
            raise serializers.ValidationError()
        attrs['user'] = user
        return attrs


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.

    ---
    **Purpose:**
        Handles user creation by validating password confirmation (`password2`)
        and enforcing Django’s password validation rules before saving the new user.

    ### Fields:
        - `email` (EmailField):
            Required. Used as the unique identifier for the user.
        - `password` (CharField, write_only=True):
            Required. The user’s password (not returned in responses).
        - `password2` (CharField, write_only=True):
            Required. Used to confirm the password entered by the user.

    ### Validation Logic:
        - Ensures that both `password` and `password2` match.
        - Runs Django’s built-in `validate_password()` function to enforce
          password strength rules (length, complexity, etc.).
        - Raises `ValidationError` if:
            - Passwords don’t match.
            - Password fails strength validation.

    ### Creation Logic:
        - Removes `password2` from the validated data.
        - Uses `User.objects.create_user(**validated_data)` to create and return
          a properly hashed user instance.

    ### Example Input:
        {
            "email": "example@gmail.com",
            "password": "MyStrongPassword123!",
            "password2": "MyStrongPassword123!"
        }

    ### Example Output (on success):
        {
            "email": "example@gmail.com"
        }

    ### Error Responses:
        - `"password must be match"`
        - `["This password is too short. It must contain at least 8 characters."]`
        - `["This password is too common."]`

    ### Notes:
        - Password fields are write-only for security reasons.
        - Designed to work with custom user models using `email` as the username field.

    Returns:
        User: Newly created user instance.
    """
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
            raise serializers.ValidationError({'password':e.message})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        return User.objects.create_user(**validated_data)



class UsersSerializer(serializers.ModelSerializer):
    """
    Serializer for representing basic user information.

    ---
    **Purpose:**
        Provides a minimal, read-only representation of the user model
        including only non-sensitive fields such as `id` and `email`.

    ### Fields:
        - `id` (IntegerField):
            The unique identifier of the user.
        - `email` (EmailField):
            The user's email address (used as the username field).

    ### Example Output:
        {
            "id": 1,
            "email": "example@gmail.com"
        }

    ### Notes:
        - This serializer is typically used in endpoints like user profile retrieval.
        - Sensitive information (e.g., password, tokens) is intentionally excluded.
    """
    class Meta:
        model = User
        fields = ["id", "email"]

class CustomeTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT token serializer extending Simple JWT's `TokenObtainPairSerializer`.

    ---
    **Purpose:**
        Extends the default JWT token serializer to include additional
        user information (`email` and `user_id`) in the validated data
        returned after successful authentication.

    ### Inherits From:
        - `rest_framework_simplejwt.serializers.TokenObtainPairSerializer`

    ### Validation Logic:
        - Calls `super().validate(attrs)` to perform default JWT authentication
          (username/email + password verification).
        - Adds extra fields to the validated data:
            - `email`: The authenticated user's email.
            - `user_id`: The authenticated user's unique identifier.

    ### Example Input:
        {
            "email": "user@example.com",
            "password": "password123"
        }

    ### Example Output:
        {
            "refresh": "<refresh_token_string>",
            "access": "<access_token_string>",
            "email": "user@example.com",
            "user_id": 1
        }

    ### Notes:
        - Designed to be used with `CustomeObtainPairView`.
        - Does not alter token payload itself, only adds extra fields to the serializer response.
        - Ensures clients receive both authentication tokens and basic user info in a single response.

    Returns:
        dict: JWT tokens along with additional user information.
    """
    
    def validate(self, attrs):
        validated_data = super().validate(attrs)
        validated_data['email'] = self.user.email
        validated_data['user_id'] = self.user.id
        return validated_data

class ChangePasswordSerializer(serializers.Serializer):
    """
        Serializer for handling password change requests.

        Fields:
        -------
        old_password: str
            The user's current password. Required.
        new_password: str
            The new password the user wants to set. Required.
        new_password1: str
            Confirmation of the new password. Must match new_password. Required.

        Validation:
        -----------
        - Checks that new_password and new_password1 match.
        - Validates the new_password against Django's password validation rules.
          If validation fails, returns the corresponding error messages.

        Usage:
        ------
        Use this serializer to validate and update the user's password in password
        change endpoints.
        """
    old_password = serializers.CharField(max_length=255, required=True,write_only = True,trim_whitespace=False)
    new_password = serializers.CharField(max_length=255, required=True,write_only = True,trim_whitespace=False)
    new_password1 = serializers.CharField(max_length=255, required=True,write_only = True,trim_whitespace=False)

    def validate(self, data):
        user = self.context['request'].user
        old_password=data['old_password']
        new_password=data['new_password']
        new_password1 = data['new_password1']
        
        
        if not user.check_password(old_password):
            raise serializers.ValidationError({
                'old_password':'Your current password is incorrect.'
            })
        
        if new_password != new_password1:
            raise serializers.ValidationError({
                "new_password1": _("Passwords do not match.")
            })
            
        if old_password == new_password :
             raise serializers.ValidationError({
                "new_password": _("New password must be different from the current password.")
            })
        try:
            validate_password(password=new_password,user=user)
            
        except ValidationError as e :
             raise serializers.ValidationError({
                "new_password": e.messages
            }) 




class SendCodeSerializer(serializers.Serializer):
    """
    Serializer for validating email input when requesting a password reset code.

    This serializer ensures that the provided email address is syntactically valid
    and can be safely used to initiate the password reset flow. It is typically used
    in endpoints responsible for sending verification or reset codes to users.

    Fields:
        email (EmailField):
            - Required
            - Must be a valid email address format

    Usage:
        - Validates incoming request data for password reset code requests.
        - Acts as a lightweight validation layer without database interaction.

    Validation Errors:
        - Returns a validation error if the email field is missing or invalid.
    """
    email = serializers.EmailField()

class VerifyCodeSerializer(serializers.Serializer):
    """
    Serializer for validating a password reset verification code.

    This serializer validates a 6-digit reset code against the
    PasswordResetCode model. It ensures that the code exists and
    has not expired. Upon successful validation, the related user
    is attached to the serializer instance for downstream usage
    (e.g. authentication or token generation).

    Fields:
        code (CharField):
            - Required
            - Maximum length: 6
            - Represents the password reset verification code

    Validation Logic:
        - Verifies that the provided code exists in PasswordResetCode.
        - Ensures the code has not expired.
        - Raises a validation error for invalid or expired codes.

    Side Effects:
        - Sets `self.user` with the user associated to the valid reset code.
          This allows views to access the authenticated user after validation
          without performing additional database queries.

    Validation Errors:
        - "Invalid code": Code does not exist.
        - "Code expired": Code exists but is no longer valid.

    Usage:
        serializer.is_valid(raise_exception=True)
        user = serializer.user
    """
    email = serializers.EmailField()
    code = serializers.RegexField(
    regex=r"^\d{6}$",
    write_only=True)

    def validate(self, attrs):
        email = attrs['email']
        code = attrs['code']
        
        try:
            obj = PasswordResetCode.objects.select_related(
                'user'
                ).get(user__email=email,code=code)
        except PasswordResetCode.DoesNotExist:
            raise serializers.ValidationError({
                "code": "Invalid code."
            }) 
        if obj.is_expired():
            raise serializers.ValidationError({
                "code": "Code expired."
            })
        self.user = obj.user
        return attrs


class CheckMeSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields = ['pk','email']
        read_only_fields =['pk','email']