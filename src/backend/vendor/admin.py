
from django.contrib import admin

from .models import (
    Manager,
    Admin,
    Operator,
    Store,
    ShopAddress,
    ShopRate,
)


class ShopAddressInline(admin.TabularInline):
    model = ShopAddress
    extra = 0


class ShopRateInline(admin.TabularInline):
    model = ShopRate
    extra = 0


@admin.register(Manager)
class ManagerAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "first_name",
        "last_name",
        "is_manager",
    )

    list_filter = (
        "is_manager",
    )

    search_fields = (
        "user__email",
        "first_name",
        "last_name",
    )

    autocomplete_fields = (
        "user",
    )

    ordering = ("id",)


@admin.register(Admin)
class AdminAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "username",
        "shop",
    )

    search_fields = (
        "user__email",
        "username",
        "shop__name",
    )

    autocomplete_fields = (
        "user",
        "shop",
    )

    ordering = ("id",)


@admin.register(Operator)
class OperatorAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "username",
        "shop",
    )

    search_fields = (
        "user__email",
        "username",
        "shop__name",
    )

    autocomplete_fields = (
        "user",
        "shop",
    )

    ordering = ("id",)


@admin.register(Store)
class StoreAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "manager",
        "created_at",
    )

    list_filter = (
        "created_at",
    )

    search_fields = (
        "name",
        "manager__user__email",
    )

    autocomplete_fields = (
        "manager",
    )

    readonly_fields = (
        "created_at",
    )

    inlines = [
        ShopAddressInline,
        ShopRateInline,
    ]

    ordering = ("-created_at",)


@admin.register(ShopAddress)
class ShopAddressAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "store",
        "street",
        "city",
        "state",
    )

    list_filter = (
        "city",
        "state",
    )

    search_fields = (
        "store__name",
        "street",
        "city",
        "state",
    )

    autocomplete_fields = (
        "store",
    )

    ordering = ("id",)


@admin.register(ShopRate)
class ShopRateAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "store",
        "rate",
        "total",
    )

    list_filter = (
        "store",
    )

    search_fields = (
        "store__name",
    )

    autocomplete_fields = (
        "store",
    )

    readonly_fields = (
        "total",
    )

    ordering = ("-id",)

