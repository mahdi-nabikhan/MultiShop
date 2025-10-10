from rest_framework_simplejwt.authentication import JWTAuthentication

class CookieJWTAuthentication(JWTAuthentication):
   
    def authenticate(self, request):
        header = None
        raw_token = request.COOKIES.get('access_token')  # 👈 از کوکی می‌خواند
        if raw_token is None:
            return None
        validated_token = self.get_validated_token(raw_token)
        return self.get_user(validated_token), validated_token
