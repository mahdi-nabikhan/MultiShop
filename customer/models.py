from django.db import models
from account.models import *
from website.models import *


# Create your models here.


class Customer(models.Model):
    """
    Model representing a Customer in the system.

    Responsibilities
    ----------------
    - Links a Django User account to a Customer profile.
    - Stores additional customer-specific information (e.g., username).
    - Provides a flag to identify the instance as a Customer.

    Fields
    ------
    user : OneToOneField(User)
        - Each Customer is associated with exactly one User.
        - on_delete=models.CASCADE ensures that deleting the User also deletes the Customer.
    username : CharField(max_length=225, null=True, blank=True)
        - Optional display name for the Customer.
    is_customer : BooleanField(default=True)
        - Flag to indicate this instance is a Customer (useful for role-based logic).

    Methods
    -------
    __str__(self)
        - Returns the email of the linked User for readable representation.

    Usage
    -----
        # Creating a Customer
        user = User.objects.create_user(email="user@example.com", password="password123")
        customer = Customer.objects.create(user=user, username="JohnDoe")

        # Accessing linked User
        email = customer.user.email

    Notes
    -----
    - This model is often used in conjunction with orders, addresses, comments, and ratings.
    - Ensures a one-to-one relationship between User accounts and Customer profiles.
    """
    user=models.OneToOneField(User,on_delete=models.CASCADE)
    username = models.CharField(max_length=225,null=True,blank=True)
    is_customer = models.BooleanField(default=True)

    def __str__(self):
        return self.user.email


class Address(models.Model):
    """
         address information for a customer.

        Fields:
            customer (FK): Reference to the Customer who owns this address.
            street, city, state, postal_code: Address fields.
        """
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    street = models.CharField(max_length=100)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=100)

    def __str__(self):
        return f" {self.street} {self.city} {self.state} {self.postal_code}"


class Comments(models.Model):
    """
        Represents a comment made by a user on a product, optionally supporting replies
        (nested comments) and a moderation status.

        Fields:
            descriptions (TextField): The content of the comment.
            user (ForeignKey): The customer who wrote the comment.
                               When deleted, all their comments are removed as well.
            product (ForeignKey): The product the comment is associated with.
                                  Deleting the product removes its comments.
            parent (ForeignKey): Optional reference to a parent comment to support nested replies.
                                 Null for top-level comments.
            status (CharField): Moderation status of the comment.
                                Can be 'Pending', 'Confirmed', or 'Rejected'.

        Status Choices:
            P - Pending: Awaiting approval/moderation.
            C - Confirmed: Approved and visible to others.
            R - Rejected: Disapproved by a moderator/admin.

        Methods:
            __str__(): Returns a string showing the user, product, and comment status.
        """

    class Status(models.TextChoices):
        pending = 'P', 'Pending'
        confirmed = 'C', 'Confirmed'
        rejected = 'R', 'Rejected'

    descriptions = models.TextField()
    user = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='comment_customer')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_customer')
    parent = models.ForeignKey('self', null=True, blank=True, related_name='replay', on_delete=models.CASCADE)
    status = models.CharField(choices=Status.choices, default=Status.pending, max_length=20)

    def __str__(self):
        return f"{self.user} {self.product} {self.status}"
