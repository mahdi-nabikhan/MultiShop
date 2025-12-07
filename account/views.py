from django.shortcuts import render
from django.views.generic import TemplateView,View
    
from django.shortcuts import redirect
from django.urls import reverse
from django.views import View
from order.utils import transfer_session_cart_to_db
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError

# Create your views here.


class LoginView(TemplateView):
    """
    Template view for user login page.

    ---
    **Purpose:**
        Renders the login page template for users to enter their credentials.

    ### Attributes:
        - `template_name` (str): Path to the login HTML template (`accounts/login.html`).

    ### Notes:
        - No additional context or logic is added.
        - Typically linked to the URL `account:login`.
        - Can be extended in the future to pass extra context to the template.
    """
    template_name = 'accounts/login.html'


class JwtLogin(TemplateView):
    """
    Template view for JWT-based login page.

    ---
    **Purpose:**
        Renders the JWT login page template for users to authenticate
        via JWT-based mechanisms (e.g., cookie-based or token-based login).

    ### Attributes:
        - `template_name` (str): Path to the JWT login HTML template
          (`accounts/jwt_login.html`).

    ### Notes:
        - Typically linked to the URL `account:jwt_login`.
        - No additional context or logic is provided in this view.
        - Can be extended to include extra context or client-side JWT handling.
    """
    template_name='accounts/jwt_login.html'
    


class CheckoutRedirectView(View):
    """
    View to handle redirection to the checkout page with user authentication.

    ---
    **Purpose:**
        Ensures that only authenticated users can access the checkout page.
        Handles JWT-based authentication from cookies and transfers session cart
        data to the database before redirecting to the actual checkout.

    ### Behavior:
        1. Reads `access_token` from HTTP-only cookies.
        2. Attempts to validate the token and retrieve the associated user.
        3. If the token is invalid or missing:
            - Redirects the user to the JWT login page (`account:jwt_login`).
        4. If the user is authenticated:
            - Calls `transfer_session_cart_to_db(request, user)` to persist session cart.
            - Redirects the user to the actual checkout page (`checkout_page`).

    ### Notes:
        - Relies on `CookieJWTAuthentication` or standard `JWTAuthentication` for token validation.
        - Uses Django's `redirect` and `reverse` utilities for URL handling.
        - Does not handle exceptions beyond invalid or expired tokens.
        - Suitable for web clients using cookie-based JWT authentication.
    """
    def get(self, request, *args, **kwargs):
        access_token = request.COOKIES.get('access_token')
        user = None

        if access_token:
            try:
                validated_token = JWTAuthentication().get_validated_token(access_token)
                user = JWTAuthentication().get_user(validated_token)
            except (InvalidToken, TokenError):
                user = None

        if not user:
          
            login_url = reverse('account:jwt_login')
            return redirect(login_url)

     
        transfer_session_cart_to_db(request, user)
        return redirect('checkout_page')


class SendResetPasswordTemplate(TemplateView):
    template_name='accounts/send_resend_code_login.html'
    