from django.db import models
from account.models import *
from website.models import *


# Create your models here.


class Customer(User):
    username = models.CharField(max_length=225,null=True,blank=True)
    is_customer = models.BooleanField(default=True)

    def __str__(self):
        return self.email


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
