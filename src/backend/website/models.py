from django.db import models
from django.db.models import Sum
from vendor.models import Store
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from auditlog.registry import auditlog




# Create your models here.
class Category(models.Model):
    """
        Represents a product or content category which can be nested hierarchically.

        Fields:
            title (CharField): The name/title of the category.
            image (ImageField): An optional image representing the category (e.g., icon or banner).
            description (TextField): A detailed description of the category.
            is_parent (ForeignKey): Self-referential link to the parent category.
                Allows building a hierarchy/tree of categories.
                Nullable and optional for root categories.
        """
    title = models.CharField(max_length=250)
    image = models.ImageField(upload_to='category_image')
    description = models.TextField()
    is_parent = models.ForeignKey('self', blank=True, null=True, related_name='parent', on_delete=models.CASCADE)


class Discount(models.Model):
    """
        Represents a discount that can be applied to products or orders.

        Fields:
            discount_type (CharField): Specifies the type of discount.
                - 'cash': fixed amount discount.
                - 'percentage': percentage-based discount.
            value (IntegerField): The numeric value of the discount.
                For 'cash' type, it's the amount in currency units.
                For 'percentage', it's the discount percent (e.g., 10 for 10%).
        """

    class DiscountType(models.TextChoices):
        cash = 'cash', 'Cash'
        percentage = 'percentage', 'Percentage'

    discount_type = models.CharField(max_length=250, choices=DiscountType.choices)
    value = models.IntegerField()
    products = models.OneToOneField('Product', on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return f'{self.discount_type}: {self.value}'

    def apply_discount(self, price: int) -> int:
        if self.discount_type == 'cash':
            return max(price - self.value, 0)
        elif self.discount_type == 'percentage':
            return max(int(price * (1 - (self.value / 100))), 0)
        return price
auditlog.register(Discount)

class Product(models.Model):
    """
        Represents a product available in a store with inventory, pricing, category, and optional discount.

        Fields:
            name (CharField): The product name.
            description (TextField): Detailed description of the product.
            quantity_in_stock (PositiveIntegerField): Current available stock quantity.
            price (PositiveIntegerField): Original price of the product before discount.
            discount (OneToOneField): Optional link to a Discount object. Null if no discount applies.
            price_after (PositiveIntegerField): Price after applying discount, optional and nullable.
            category (ForeignKey): The category this product belongs to.
            store (ForeignKey): The store offering this product.
        """
    name = models.CharField(max_length=250)
    description = models.TextField()
    quantity_in_stock = models.PositiveIntegerField()
    price = models.PositiveIntegerField()
    price_after = models.PositiveIntegerField(null=True, blank=True)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='product_category')
    store = models.ForeignKey(Store, on_delete=models.CASCADE, related_name='product_store')
    product_image = models.ImageField(upload_to='product_images', null=True, blank=True)

    def __str__(self):
        return f"{self.name} {self.description}"

auditlog.register(Product)
class ProductImages(models.Model):
    product_image = models.ImageField(upload_to='product_images', null=True, blank=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='image_for_product')
    title = models.CharField(max_length=200, null=True, blank=True)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return f'{self.title} {self.product.name}'

auditlog.register(ProductImages)
class ProductRate(models.Model):
    rate = models.PositiveIntegerField()
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product_rate')
    total_rate = models.PositiveIntegerField(null=True, blank=True)

    def save(self, *args, **kwargs):
        self.total_rate = self.get_total_rate()
        return super().save(*args, **kwargs)

    def get_total_rate(self):
        total = ProductRate.objects.filter(product=self.product).aggregate(total=Sum('rate'))['total']
        return total

    def __str__(self):
        return f'{self.product} {self.rate}'


@receiver(post_save, sender=Discount)
def update_product_price_after(sender, instance, **kwargs):
    if instance.products:
        instance.products.price_after = instance.apply_discount(instance.products.price)
        instance.products.save(update_fields=['price_after'])


@receiver(post_delete, sender=Discount)
def reset_product_price_after(sender, instance, **kwargs):
    if instance.products:
        instance.products.price_after = instance.products.price
        instance.products.save(update_fields=['price_after'])




# @receiver(post_save, sender=Product)
# def index_product(sender, instance, **kwargs):
#     doc = {
#         "name": instance.name,
#         "name_auto": instance.name,
#         "description": instance.description,
#         "price": instance.price,
#         "price_after": instance.price_after,
#         "quantity_in_stock": instance.quantity_in_stock,
#         "category": instance.category.id,
#         "store": instance.store.id,
#     }
#     es.index(index="products_index", id=instance.id, document=doc)


# @receiver(post_delete, sender=Product)
# def delete_product(sender, instance, **kwargs):
#     es.delete(index="products_index", id=instance.id, ignore=[404])
