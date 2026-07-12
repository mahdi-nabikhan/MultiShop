
from django.contrib import admin

from .models import Customer, Address, Comments


@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "username",
        "is_customer",
    )

    list_filter = (
        "is_customer",
    )

    search_fields = (
        "user__email",
        "username",
    )

    ordering = ("id",)

    autocomplete_fields = (
        "user",
    )


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "customer",
        "street",
        "city",
        "state",
        "postal_code",
    )

    search_fields = (
        "customer__user__email",
        "street",
        "city",
        "state",
        "postal_code",
    )

    list_filter = (
        "city",
        "state",
    )

    ordering = ("id",)

    autocomplete_fields = (
        "customer",
    )


@admin.register(Comments)
class CommentsAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "product",
        "status",
        "parent",
    )

    list_filter = (
        "status",
        "product",
    )

    search_fields = (
        "user__user__email",
        "product__name",
        "descriptions",
    )

    ordering = ("-id",)

    autocomplete_fields = (
        "user",
        "product",
        "parent",
    )

    list_editable = (
        "status",
    )

    readonly_fields = ()

    fieldsets = (
        (
            "Comment Information",
            {
                "fields": (
                    "user",
                    "product",
                    "parent",
                    "status",
                    "descriptions",
                )
            },
        ),
    )

