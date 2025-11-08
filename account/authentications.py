from rest_framework_simplejwt.authentication import JWTAuthentication

class CookieJWTAuthentication(JWTAuthentication):
    """
    Custom JWT authentication class that reads tokens from cookies instead of headers.

    ---
    **Purpose:**
        Extends `rest_framework_simplejwt.authentication.JWTAuthentication`
        to authenticate users using a JWT stored in an HTTP-only cookie
        (`access_token`) instead of the standard `Authorization` header.

    ### Behavior:
        - Attempts to read the JWT from the `access_token` cookie.
        - If no cookie is found, authentication returns `None`.
        - Validates the token using `get_validated_token`.
        - Returns a tuple `(user, validated_token)` upon successful validation.

    ### Notes:
        - Designed for cookie-based authentication scenarios (e.g., web clients)
          where storing the JWT in headers is not desired.
        - Can be used as the `authentication_classes` in DRF views or globally
          in REST framework settings.
        - Does not override token expiration or validation logic; relies on parent class.
    """
   
    def authenticate(self, request):
        header = None
        raw_token = request.COOKIES.get('access_token')  # 👈 از کوکی می‌خواند
        if raw_token is None:
            return None
        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token
