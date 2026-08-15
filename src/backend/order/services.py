from django.db import transaction
from django.core.exceptions import ValidationError

from .models import Product
from utils.redis_lock import RedisDistributedLock


def decrease_product_stock(product_id, quantity):
    lock_key = f"product-stock:{product_id}"

    with RedisDistributedLock(
        key=lock_key,
        timeout=10,
        blocking_timeout=5,
    ):
        with transaction.atomic():
            product = (
                Product.objects
                .select_for_update()
                .get(pk=product_id)
            )

            if product.quantity_in_stock < quantity:
                raise ValidationError(
                    "Requested quantity exceeds available stock."
                )

            product.quantity_in_stock -= quantity

            product.save(
                update_fields=["quantity_in_stock"]
            )

            return product