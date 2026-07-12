
from django.contrib import admin

from .models import Order, OrderItem, Bill


class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0
    autocomplete_fields = ("product",)


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "customer",
        "status",
        "created",
    )

    list_filter = (
        "status",
        "created",
    )

    search_fields = (
        "customer__user__email",
        "customer__username",
    )

    ordering = ("-created",)

    autocomplete_fields = (
        "customer",
    )

    readonly_fields = (
        "created",
    )

    list_editable = (
        "status",
    )

    inlines = [OrderItemInline]


@admin.register(OrderItem)
class OrderItemAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "order",
        "product",
        "quantity",
        "total",
        "status",
        "created",
    )

    list_filter = (
        "status",
        "created",
        "product",
    )

    search_fields = (
        "order__customer__user__email",
        "product__name",
    )

    ordering = ("-created",)

    autocomplete_fields = (
        "order",
        "product",
    )

    readonly_fields = (
        "total",
        "created",
    )

    list_editable = (
        "status",
    )

    fieldsets = (
        (
            "Order Item",
            {
                "fields": (
                    "order",
                    "product",
                    "quantity",
                    "status",
                )
            },
        ),
        (
            "Pricing",
            {
                "fields": (
                    "total",
                    "created",
                )
            },
        ),
    )


@admin.register(Bill)
class BillAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "cart",
        "address",
        "status",
        "created_at",
    )

    list_filter = (
        "status",
        "created_at",
    )

    search_fields = (
        "cart__customer__user__email",
        "address__street",
        "address__city",
    )

    ordering = ("-created_at",)

    autocomplete_fields = (
        "cart",
        "address",
    )

    readonly_fields = (
        "created_at",
    )

    list_editable = (
        "status",
    )

