from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer
from customer.models import *
from vendor.models import *
from django.shortcuts import reverse
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from django.urls import reverse
from rest_framework.generics import UpdateAPIView
from order.utils import transfer_session_cart_to_db
from account.throttels import *
from django.core.mail import send_mail
from rest_framework.generics import GenericAPIView
import random
from account.tasks import *
class CustomObtainAuthToken(ObtainAuthToken):
    """
    Custom authentication endpoint for obtaining user tokens.

    This view authenticates a user using provided credentials (username and password),
    generates or retrieves an existing authentication token, and determines the redirect
    URL based on the user's role in the system.

    ---
    **Request method:** `POST`
    **Authentication required:** No
    **Throttling:** Not applied (can be customized via `account.throttles`)
    **Permissions:** `AllowAny`

    ### Request Body:
        {
            "username": "string",
            "password": "string"
        }

    ### Successful Response (HTTP 200):
        {
            "user-id": int,
            "token": "string",
            "redirect_url": "string | null"
        }

    ### Error Response (HTTP 400):
        {
            "non_field_errors": ["Unable to log in with provided credentials."]
        }

    ### Role-based Redirect Logic:
        - Customer  → reverse('shop-list')
        - Admin     → reverse('vendors:panel')
        - Manager   → reverse('vendors:panel')
        - Operator  → reverse('vendors:panel')

    ### Notes:
        - Uses DRF's built-in Token model (`rest_framework.authtoken.models.Token`)
        - Uses custom `LoginSerializer` for authentication validation
        - This endpoint should typically be mounted at `/api/v1/login/`
        - Consider adding throttling for brute-force protection

    Returns:
        Response: A JSON response containing the user ID, authentication token,
        and redirect URL based on user type.
    """
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        data = request.data
        redirect_url = None
        serializer = self.serializer_class(data=data, context={'request': request})
        if serializer.is_valid():
            user = serializer.validated_data.get('user')
            token, create = Token.objects.get_or_create(user=user)
            if Customer.objects.filter(user=user).exists():
                redirect_url = reverse('shop-list')
            if Admin.objects.filter(user=user).exists():
                redirect_url = reverse('vendors:panel')
            if Manager.objects.filter(user=user).exists():
                redirect_url = reverse('vendors:panel')
            if Operator.objects.filter(user=user).exists():
                redirect_url = reverse('vendors:panel')

            return Response({'user-id': user.id, 'token': token.key, 'redirect_url': redirect_url},
                            status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ProfileApiView(APIView):
    """
    Retrieve the authenticated user's profile data.

    ---
    **Request method:** `GET`  
    **Authentication required:** Yes (`IsAuthenticated`)  
    **Permissions:** `IsAuthenticated`  
    **Throttling:** None  

    ### Description:
        Returns serialized profile information of the currently authenticated user.
        The user instance is taken from `request.user`, serialized using `UsersSerializer`,
        and returned as JSON response.

    ### Response (HTTP 200):
        {
            "id": int,
            "username": "string",
            "email": "string",
            ... // other user fields defined in UsersSerializer
        }

    ### Error Responses:
        - `401 Unauthorized` → If no valid authentication credentials are provided.

    ### Notes:
        - Uses `UsersSerializer` for serialization of the `User` model.
        - No input parameters are required.
        - Prints serialized user data to console (can be removed in production).

    Returns:
        Response: JSON representation of the authenticated user's profile.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UsersSerializer(request.user)
        print('user is', serializer.data)
        return Response(serializer.data)


class LogOutApiView(APIView):
    """
    Log out the currently authenticated user by deleting their authentication token.

    ---
    **Request method:** `POST`  
    **Authentication required:** Yes (`IsAuthenticated`)  
    **Permissions:** `IsAuthenticated`  
    **Throttling:** None  

    ### Description:
        This endpoint invalidates the user's current authentication token,
        effectively logging them out of the system.
        Once the token is deleted, any subsequent requests using the same token
        will be rejected with `401 Unauthorized`.

    ### Request Body:
        None

    ### Successful Response (HTTP 200):
        {
            "details": "logged out successfully"
        }

    ### Error Responses:
        - `401 Unauthorized` → If authentication credentials are missing or invalid.
        - `500 Internal Server Error` → If token deletion fails unexpectedly.

    ### Notes:
        - This endpoint assumes the use of DRF's TokenAuthentication.
        - If using JWT, the logout behavior must be implemented differently
          (e.g., via token blacklisting).
        - Token deletion occurs through `request.user.auth_token.delete()`.

    Returns:
        Response: JSON message confirming successful logout with HTTP 200 status.
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response({'details': 'logged out successfully'}, status=status.HTTP_200_OK)


class CustomeObtainPairView(TokenObtainPairView):
    """
    Custom JWT authentication endpoint for obtaining access and refresh tokens.

    ---
    **Request method:** `POST`  
    **Authentication required:** No  
    **Permissions:** `AllowAny`  
    **Throttling:** `LoginRateThrottle`

    ### Description:
        Authenticates a user using the provided credentials and issues a pair of JWT tokens
        (`access` and `refresh`).  
        After successful authentication, the user's session cart is transferred to the database,
        and role-based redirect URL is determined.  
        Both tokens are stored as HTTP-only cookies in the response.

    ### Request Body:
        {
            "username": "string",
            "password": "string"
        }

    ### Successful Response (HTTP 200):
        {
            "user_id": int,
            "redirect_url": "string | null"
        }

    ### Error Responses:
        - `400 Bad Request` → Invalid credentials or serializer validation failure.
        - `429 Too Many Requests` → If login attempts exceed the defined throttle limit.

    ### Behavior:
        - Validates user credentials using `CustomeTokenObtainPairSerializer`.
        - Generates a JWT access token and a refresh token for the authenticated user.
        - Transfers the user's session cart to the database using `transfer_session_cart_to_db()`.
        - Determines the redirect URL based on user role:
            - `Customer` → `reverse('shop-list')`
            - `Admin` / `Manager` / `Operator` → `reverse('vendors:panel')`
        - Sets both tokens as secure, HTTP-only cookies with `samesite='Strict'`.

    ### Cookie Details:
        - **access_token**
            - Lifetime: 15 minutes
            - `HttpOnly`, `Secure`, `SameSite=Strict`
        - **refresh_token**
            - Lifetime: 7 days
            - `HttpOnly`, `Secure`, `SameSite=Strict`

    ### Notes:
        - Uses `rest_framework_simplejwt.tokens.RefreshToken` for token generation.
        - Designed for clients using cookie-based authentication instead of Authorization headers.
        - Exception handling around `transfer_session_cart_to_db` logs failures gracefully.
        - Does not include tokens directly in response body for security reasons.

    Returns:
        Response: JSON object containing user ID and redirect URL with JWT tokens
        stored as cookies in the response.
    """
    serializer_class = CustomeTokenObtainPairSerializer
    throttle_classes = [LoginRateThrottle]

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            user = serializer.user
            data=serializer.validated_data
            access_token = data['access']
            refresh_token = data['refresh']
            try:
                order = transfer_session_cart_to_db(request, user)
            except Exception as e:
                import logging
                logging.exception("خطا در انتقال سبد از سشن به سفارش: %s", e)
                order = None


            redirect_url = None
            if Customer.objects.filter(user=user).exists():
                redirect_url = 'shop_list'
            elif Admin.objects.filter(user=user).exists():
                redirect_url = 'panel'
            elif Manager.objects.filter(user=user).exists():
                redirect_url = 'panel'
            elif Operator.objects.filter(user=user).exists():
                redirect_url = 'panel'

            response = Response({
                'user_id': user.id,
                'redirect_url': redirect_url,
                # 'access_token':access_token,
                # 'refresh_token':refresh_token
            }, status=200)


            response.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=True,
                samesite='Strict',
                max_age=60 * 15
            )
            response.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True,
                secure=True,
                samesite='Strict',
                max_age=60*60*24*7  # 7 روز
            )

            return response

        return Response(serializer.errors, status=400)
class ChangePasswordView(UpdateAPIView):
    """
               ChangePasswordView allows an authenticated user to change their password.

               This endpoint requires the user to provide their current password and a new password.

               PUT /accounts/api/v1/change-password/
               --------------------------------------

               ### Authentication Required:
               - Yes (JWT or Token)

               ### Request Body (JSON):
               {
                   "old_password": "current_password",
                   "new_password": "new_secure_password"
               }

               ### Successful Response (200 OK):
               {
                   "message": "Password changed successfully"
               }

               ### Error Responses:
               - 400 Bad Request: If the old password is incorrect or validation fails.
               {
                   "old_password": "Your password is wrong"
               }

               ### Notes:
               - Only the authenticated user can change their own password.
               - Validation and password hashing are handled via the serializer and Django's built-in methods.
               """
    model = User
    permission_classes = (IsAuthenticated,)
    serializer_class = ChangePasswordSerializer

    def get_object(self):

        """Returns the current authenticated user object."""
        obj = self.request.user
        return obj

    def update(self, request, *args, **kwargs):
        """
                Handle PUT request to change the authenticated user's password.

                Validates the old password and updates the password to the new one if valid.

                Returns:
                    - 200 OK on success
                    - 400 Bad Request on validation failure
                """
        self.object = self.get_object()
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            if not self.object.check_password(serializer.data.get('old_password')):
                return Response({'old password': 'your password is wrong'}, status=status.HTTP_400_BAD_REQUEST)
            self.object.set_password(serializer.data.get('new_password'))
            self.object.save()
            return Response({'massage': 'password changed successfully'}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors)

# views.py


class SendResetCodeApiView(GenericAPIView):
    """
    API endpoint for sending a password reset verification code to the user's email.

    This view validates the provided email address, ensures that a user with the
    given email exists, generates a 6-digit numeric reset code, and stores it in
    the PasswordResetCode model. The reset code is then sent asynchronously to
    the user's email using Celery background tasks.

    Workflow:
        1. Validate incoming request data using SendCodeSerializer.
        2. Retrieve the user associated with the given email.
        3. Generate a random 6-digit reset code.
        4. Persist the reset code in the database.
        5. Dispatch asynchronous email tasks to deliver the reset code.

    Authentication:
        - No authentication required (public endpoint).

    Permissions:
        - Open access.

    Request Body:
        {
            "email": "user@example.com"
        }

    Responses:
        200 OK:
            {
                "message": "Code sent to email"
            }

        400 Bad Request:
            - Invalid email format
            - Missing required fields

        404 Not Found:
            - User with the provided email does not exist

    Side Effects:
        - Creates a PasswordResetCode record in the database.
        - Triggers Celery tasks for sending reset emails.

    """
    serializer_class = SendCodeSerializer
    permission_classes = []

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        email = serializer.validated_data["email"]
        user = User.objects.get(email=email)

        code = f"{random.randint(100000, 999999)}"
        PasswordResetCode.objects.create(user=user, code=code)

        send_reset_code_email.delay(email=email,code=code)
        send_password_email.delay(email=email,code=code)
        return Response({"message": "Code sent to email"})

class VerifyResetCodeApiView(GenericAPIView):
    """
    API endpoint for verifying a password reset code and authenticating the user.

    This view validates the submitted reset code using VerifyCodeSerializer.
    Upon successful verification, the associated user is authenticated by
    generating JWT access and refresh tokens. The tokens are stored securely
    in HTTP-only cookies, and a role-based redirect URL is returned in the response.

    Workflow:
        1. Validate the reset code and retrieve the related user via serializer.
        2. Generate JWT access and refresh tokens for the authenticated user.
        3. Determine the user's role and resolve the appropriate redirect URL.
        4. Set access and refresh tokens as secure HTTP-only cookies.
        5. Return a success response with redirect information.

    Authentication:
        - No authentication required (public endpoint).
        - Authentication is established after successful code verification.

    Permissions:
        - Open access.

    Cookies:
        - access_token:
            * HTTP-only
            * Secure
            * SameSite=Strict
        - refresh_token:
            * HTTP-only
            * Secure
            * SameSite=Strict

    Request Body:
        {
            "email": "user@example.com",
            "code": "123456"
        }

    Responses:
        200 OK:
            {
                "message": "Login successful",
                "redirect_url": "/resolved/path/"
            }

        400 Bad Request:
            - Invalid or expired reset code
            - Missing required fields

        404 Not Found:
            - User or reset code not found

    Role-Based Redirect Logic:
        - Customer   → shop-list
        - Admin      → vendors:panel
        - Manager    → vendors:panel
        - Operator   → vendors:panel

    Security Considerations:
        - Tokens are never exposed in the response body.
        - Cookies are protected against XSS via HTTP-only flag.
        - Secure flag enforces HTTPS-only transmission.

    """
    serializer_class = VerifyCodeSerializer
    permission_classes = []

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = serializer.user

        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)
        redirect_url = None
        if Customer.objects.filter(user=user).exists():
            redirect_url = reverse('shop-list')
        elif Admin.objects.filter(user=user).exists():
            redirect_url = reverse('vendors:panel')
        elif Manager.objects.filter(user=user).exists():
            redirect_url = reverse('vendors:panel')
        elif Operator.objects.filter(user=user).exists():
            redirect_url = reverse('vendors:panel')
        response= Response({
            "message": "Login successful",
            'redirect_url':redirect_url
        } )
        response.set_cookie(
            key="access_token",
            value=str(access_token),
            httponly=True,
            secure=True,   
            samesite="Strict"
        )
        response.set_cookie(
            key="refresh_token",
            value=str(refresh_token),
            httponly=True,
            secure=True,
            samesite="Strict"
        )

        return response
    
    
    
class CheckMeAPIView(GenericAPIView):
    serializer_class=CheckMeSerializer
    
    
    def get_queryset(self):
        return User.objects.get(pk=self.request.user.pk)
    
    def get(self,request):
        obj = self.get_queryset()
        serializer = self.serializer_class(instance=obj)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
    
