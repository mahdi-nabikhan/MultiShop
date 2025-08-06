from django.db import models
from customer.models import *
from website.models import *


# Create your models here.


class Order(models.Model):
    """
        Represents a customer's order in the system.

        Fields:
            customer (ForeignKey): A reference to the Customer who placed the order.
                                   When the customer is deleted, all related orders are also deleted.
            status (BooleanField): Indicates whether the order is completed or not.
                                   Defaults to False (e.g., pending).
            created (DateTimeField): The timestamp when the order was created. Automatically set on creation.

        Methods:
            __str__: Returns a string representation of the order, including the customer's first name.
        """

    customer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    status = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.customer.first_name},"


class OrderItem(models.Model):
    """
        Represents a single item within an order, linking a product to an order
        along with its quantity, status, and pricing.

        Fields:
            order (ForeignKey): Reference to the associated Order. When the order is deleted,
                                related items are also deleted.
            product (ForeignKey): Reference to the purchased Product. Deleting the product also deletes this item.
            quantity (PositiveIntegerField): Number of units of the product in this order item.
            status (CharField): Status of the order item. Can be 'Pending' or 'Confirmed'.
            created (DateTimeField): Timestamp when this item was created. Automatically set on creation.
            total (DecimalField): Total price for this item (quantity * product price). Automatically calculated.

        Methods:
            get_total_price(): Calculates the total price based on quantity and product price.
            save(): Overrides the save method to auto-calculate and store the total price.
            __str__(): Returns a readable representation of the item (e.g., "ProductName, Quantity").
        """

    class Status(models.TextChoices):
        pending = 'P', 'Pending'
        confirmed = 'C', 'Confirmed'

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='order_item')
    quantity = models.PositiveIntegerField()

    status = models.CharField(choices=Status.choices, default=Status.pending, max_length=20)
    created = models.DateTimeField(auto_now_add=True)
    total = models.DecimalField(null=True, decimal_places=2, max_digits=10, blank=True)

    def get_total_price(self):
        """Calculates and returns the total price for this order item."""
        return self.quantity * self.product.price

    def save(self, *args, **kwargs):
        """Overrides the default save method to set the total price before saving."""
        self.total_price = self.get_total_price()
        return super(OrderItem, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.product.name},{self.quantity}"


class Bill(models.Model):
    """
        Represents a billing record for a specific cart (OrderItem), containing delivery address,
        creation date, and payment/delivery status.

        Fields:
            cart (OneToOneField): A one-to-one relationship with an OrderItem.
                                  Each order item can have at most one bill.
            created_at (DateField): The date the bill was created. Automatically set on creation.
            address (ForeignKey): The delivery or billing address associated with the bill.
                                  Deleting the address also deletes this bill.
            status (BooleanField): Indicates whether the bill has been paid or processed.
                                   Defaults to False (e.g., unpaid).

        Methods:
            __str__(): Returns a string representation including the related cart and creation date.
        """
    cart = models.OneToOneField(OrderItem, on_delete=models.CASCADE, related_name='bill_cart')
    created_at = models.DateField(auto_now_add=True)
    address = models.ForeignKey(Address, on_delete=models.CASCADE, related_name='bill_address')
    status = models.BooleanField(default=False)

    def __str__(self):
        return f'{self.cart} created at {self.created_at}'
