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
class CustomObtainAuthToken(ObtainAuthToken):
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
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UsersSerializer(request.user)
        print('user is', serializer.data)
        return Response(serializer.data)


class LogOutApiView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response({'details': 'logged out successfully'}, status=status.HTTP_200_OK)


class CustomeObtainPairView(TokenObtainPairView):
    serializer_class = CustomeTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
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

