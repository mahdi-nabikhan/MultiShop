from django.shortcuts import render
from django.views.generic import TemplateView


# Create your views here.

class CostumerRegisterTemplateView(TemplateView):
    """
    TemplateView for rendering the Customer registration page.

    Responsibilities
    ----------------
    - Displays the registration form for new customers.
    - Renders the HTML template without performing any form submission logic.
    - Typically used for GET requests to show the registration page.

    Attributes
    ----------
    template_name : str
        - Path to the template to render: 'accounts/costomer_register.html'.

    Usage
    -----
        # In urls.py
        path('register/', CostumerRegisterTemplateView.as_view(), name='register')

        # Accessing via browser
        GET /customer/register/ will render the registration form.

    Notes
    -----
    - Form handling (POST requests) should be done via API endpoints or separate views.
    - Template name contains a typo 'costomer' — ensure template file exists with the same name.
    - Suitable for integrating with front-end forms that post data to REST API endpoints.
    """
    template_name = 'accounts/costomer_register.html'



class CustomerProfileTemplateView(TemplateView):
    """
    TemplateView for displaying the authenticated Customer's profile page.

    Responsibilities
    ----------------
    - Renders the profile page for a logged-in customer.
    - Provides read-only display of customer information from the database.
    - Handles only GET requests; no form submission is processed here.

    Attributes
    ----------
    template_name : str
        - Path to the HTML template to render: 'customer/profile.html'.

    Usage
    -----
        # In urls.py
        path('customer/profile/', CustomerProfileTemplateView.as_view(), name='profile')

        # Accessing via browser
        GET /customer/profile/ will render the profile page for the authenticated user.

    Notes
    -----
    - Requires the user to be authenticated; otherwise, Django's standard
      authentication redirect applies (e.g., LOGIN_URL).
    - For editing profile data, a separate API or form view should be used.
    - Useful in combination with API endpoints for read/write customer data.
    """
    template_name='customer/profile.html'
    
class AddressDetailTemplateView(TemplateView):
    """
    TemplateView for displaying the authenticated Customer's address details.

    Responsibilities
    ----------------
    - Renders the address detail page for the logged-in customer.
    - Displays the list of addresses or specific address information.
    - Handles only GET requests; does not process form submissions.

    Attributes
    ----------
    template_name : str
        - Path to the HTML template: 'customer/address_detail.html'.

    Usage
    -----
        # In urls.py
        path('detail/address/', AddressDetailTemplateView.as_view(), name='address_detail')

        # Accessing via browser
        GET /detail/address/ will render the address detail page for the authenticated customer.

    Notes
    -----
    - Requires authentication; unauthenticated users may be redirected to LOGIN_URL.
    - Address creation or updates should be handled via API endpoints or separate form views.
    - Useful for displaying customer addresses in a dashboard or profile page.
    """
    template_name = 'customer/address_detail.html'
    
class CommentDetailTemplateView(TemplateView):
    """
    TemplateView for displaying the authenticated Customer's comments.

    Responsibilities
    ----------------
    - Renders a page showing all comments made by the logged-in customer.
    - Handles only GET requests; no creation or modification of comments occurs here.
    - Can be integrated with API endpoints for adding, editing, or deleting comments.

    Attributes
    ----------
    template_name : str
        - Path to the HTML template: 'customer/comments_detail.html'.

    Usage
    -----
        # In urls.py
        path('detail/comments/', CommentDetailTemplateView.as_view(), name='comments-detail')

        # Accessing via browser
        GET /detail/comments/ will render the page displaying the customer's comments.

    Notes
    -----
    - Requires authentication; unauthenticated users may be redirected to LOGIN_URL.
    - For creating or updating comments, use separate API endpoints or form views.
    - Ensures a consistent UI for customers to view their submitted comments.
    """
    template_name ='customer/comments_detail.html'
    
    
class CustomerOrderItemTemplateView(TemplateView):
    """
    TemplateView for displaying the authenticated Customer's order item details.

    Responsibilities
    ----------------
    - Renders a page showing details of the customer's orders and individual order items.
    - Handles only GET requests; does not process order creation or updates.
    - Can be used alongside API endpoints for dynamic order management.

    Attributes
    ----------
    template_name : str
        - Path to the HTML template: 'customer/order_detail.html'.

    Usage
    -----
        # In urls.py
        path('order/item/detail/', CustomerOrderItemTemplateView.as_view(), name='order-item-detail')

        # Accessing via browser
        GET /order/item/detail/ will render the page showing the customer's order items.

    Notes
    -----
    - Requires the user to be authenticated; otherwise, Django redirects to LOGIN_URL.
    - Any interactive order functionality (like status updates or cancellations) should
      be handled via API endpoints or separate views.
    - Provides a read-only summary of order items for the customer dashboard.
    """
    template_name='customer/order_detail.html'