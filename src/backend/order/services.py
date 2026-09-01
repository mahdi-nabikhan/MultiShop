from django.db import transaction
from django.core.exceptions import ValidationError
from django_redis import get_redis_connection
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
        




class CartService:

    CART_PREFIX = "cart:customer"

    @classmethod
    def _get_key(cls, customer_id: int) -> str:
        return f"{cls.CART_PREFIX}:{customer_id}"

    @classmethod
    def add_item(
        cls,
        customer_id: int,
        product_id: int,
        quantity: int,
    ) -> None:
        redis = get_redis_connection("cart")

        key = cls._get_key(customer_id)

        redis.hincrby(
            key,
            str(product_id),
            quantity,
        )

    @classmethod
    def get_cart(
        cls,
        customer_id: int,
    ) -> dict[int, int]:
        redis = get_redis_connection("cart")

        key = cls._get_key(customer_id)

        cart = redis.hgetall(key)

        return {
            int(product_id): int(quantity)
            for product_id, quantity in cart.items()
        }

    @classmethod
    def update_item(
        cls,
        customer_id: int,
        product_id: int,
        quantity: int,
    ) -> None:
        redis = get_redis_connection("cart")

        key = cls._get_key(customer_id)

        if quantity <= 0:
            redis.hdel(
                key,
                str(product_id),
            )
            return

        redis.hset(
            key,
            str(product_id),
            quantity,
        )

    @classmethod
    def remove_item(
        cls,
        customer_id: int,
        product_id: int,
    ) -> None:
        redis = get_redis_connection("cart")

        key = cls._get_key(customer_id)

        redis.hdel(
            key,
            str(product_id),
        )

    @classmethod
    def clear_cart(
        cls,
        customer_id: int,
    ) -> None:
        redis = get_redis_connection("cart")

        key = cls._get_key(customer_id)

        redis.delete(key)

    @classmethod
    def is_empty(
        cls,
        customer_id: int,
    ) -> bool:
        redis = get_redis_connection("cart")

        key = cls._get_key(customer_id)

        return not redis.exists(key)
