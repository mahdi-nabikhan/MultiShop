# from django.utils.deprecation import MiddlewareMixin
# from django.core.cache import cache
# from rest_framework_simplejwt.tokens import AccessToken
# from rest_framework.exceptions import AuthenticationFailed
#
# class SessionJWTMiddleware(MiddlewareMixin):
#     def process_request(self, request):
#         session_id = request.COOKIES.get('session_id')
#         if not session_id:
#             return
#
#         data = cache.get(f'session:{session_id}')
#         if not data:
#             raise AuthenticationFailed('Session expired')
#
#         access_token = data['access']
#         try:
#             validated = AccessToken(access_token)
#             request.user_id = validated['user_id']
#         except Exception:
#             raise AuthenticationFailed('Invalid token')
