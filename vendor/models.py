from account.models import *
from django.db.models import Sum
from django.db import models


# Create your models here.

class Manager(models.Model):
    user=models.OneToOneField(User,on_delete=models.CASCADE)
    first_name = models.CharField(max_length=50, blank=True, null=True)
    last_name = models.CharField(max_length=50, blank=True, null=True)
    is_manager = models.BooleanField(default=True)

    def __str__(self):
        return f'{self.user.email}'


class Admin(models.Model):
    """
        Specialized extension of the custom User model representing shop admin.

        Inherits:
            User (account.models.User): Base user model using email for authentication.

        Fields:
            is_admin (BooleanField): Distinguishes operator accounts from other user roles.
            shop (ForeignKey): Links the operator to a specific Shop instance.

        Notes:
            - Each admin is associated with exactly one shop.
            - Inherits all authentication and permission logic from User.
        """
    user=models.OneToOneField(User,on_delete=models.CASCADE)
    shop = models.ForeignKey('Store', on_delete=models.CASCADE)
    username=models.CharField(max_length=256)

    def __str__(self):
        return f'{self.user.email}'


class Operator(models.Model):
    """
        Specialized extension of the custom User model representing shop operators.

        Inherits:
            User (account.models.User): Base user model using email for authentication.

        Fields:
            is_operator (BooleanField): Distinguishes operator accounts from other user roles.
            shop (ForeignKey): Links the operator to a specific Shop instance.

        Notes:
            - Each operator is associated with exactly one shop.
            - Inherits all authentication and permission logic from User.
        """
    user=models.OneToOneField(User,on_delete=models.CASCADE)
    shop = models.ForeignKey('Store', on_delete=models.CASCADE)
    username = models.CharField(max_length=256)

    def __str__(self):
        return f'{self.user.email}'


class Store(models.Model):
    """
        Represents a shop entity managed by a single manager.

        Fields:
            manager (OneToOneField): The manager responsible for the shop.
            image (ImageField): Shop logo or banner image.
            name (CharField): The name of the shop.
            description (TextField): A detailed description of the shop's offerings.
            created_at (DateTimeField): Timestamp of when the shop was created.
        """
    manager = models.OneToOneField(Manager, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='store/', null=True, blank=True)
    name = models.CharField(max_length=120)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.name}, {self.description}, {self.manager.user.email}'


class ShopAddress(models.Model):
    """
        Stores the address details for a specific shop.

        Fields:
            shop (ForeignKey): Reference to the Shop the address belongs to.
            street (TextField): Street name and/or number.
            city (TextField): Name of the city.
            state (TextField): Name of the state or province.

        Relationships:
            - Many addresses can be linked to a single shop.
              (i.e., a shop can have multiple locations if needed.)

        Example:
            "123 Example Street, New York, NY"
        """
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    street = models.TextField()
    city = models.TextField()
    state = models.TextField()

    def __str__(self):
        return f'{self.street}, {self.city}, {self.state}'


class ShopRate(models.Model):
    """
        Represents a rating given to a store.

        Fields:
            store (ForeignKey): The store that is being rated.
            rate (DecimalField): The rating value for a single rating (e.g., 1 to 5).
            total (DecimalField): The aggregated total rating for the store (auto-calculated).

        Behavior:
            - Automatically updates the `total` field with the sum of all rates for the store
              whenever a rating instance is saved.
        """
    store = models.ForeignKey(Store, on_delete=models.CASCADE)
    rate = models.DecimalField(max_digits=5, decimal_places=0)
    total = models.DecimalField(max_digits=5, decimal_places=0, null=True, blank=True)

    def save(self, *args, **kwargs):
        self.total = self.total_rate()
        return super().save(*args, **kwargs)

    def total_rate(self):
        """
               Calculates the sum of all ratings for the store.

               Returns:
                   Decimal or None: The sum of all 'rate' values for this store.
               """
        total = ShopRate.objects.filter(store=self.store).aggregate(total=Sum('rate'))['total']
        return total
