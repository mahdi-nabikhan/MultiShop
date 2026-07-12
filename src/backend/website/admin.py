
from django.contrib import admin

from .models import (
    Category,
    Discount,
    Product,
    ProductImages,
    ProductRate,
)


class ProductImagesInline(admin.TabularInline):
    model = ProductImages
    extra = 1


class ProductRateInline(admin.TabularInline):
    model = ProductRate
    extra = 0
    readonly_fields = ("total_rate",)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "is_parent",
    )

    search_fields = (
        "title",
        "description",
    )

    list_filter = (
        "is_parent",
    )

    autocomplete_fields = (
        "is_parent",
    )

    ordering = ("title",)


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "category",
        "store",
        "price",
        "price_after",
        "quantity_in_stock",
    )

    list_filter = (
        "category",
        "store",
    )

    search_fields = (
        "name",
        "description",
        "store__name",
        "category__title",
    )

    autocomplete_fields = (
        "category",
        "store",
    )

    list_editable = (
        "price",
        "quantity_in_stock",
    )

    inlines = [
        ProductImagesInline,
        ProductRateInline,
    ]

    ordering = ("-id",)


@admin.register(ProductImages)
class ProductImagesAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "product",
    )

    search_fields = (
        "title",
        "product__name",
    )

    autocomplete_fields = (
        "product",
    )

    ordering = ("-id",)


@admin.register(ProductRate)
class ProductRateAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "product",
        "rate",
        "total_rate",
    )

    search_fields = (
        "product__name",
    )

    list_filter = (
        "product",
    )

    autocomplete_fields = (
        "product",
    )

    readonly_fields = (
        "total_rate",
    )

    ordering = ("-id",)


@admin.register(Discount)
class DiscountAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "discount_type",
        "value",
        "products",
    )

    list_filter = (
        "discount_type",
    )

    search_fields = (
        "products__name",
    )

    autocomplete_fields = (
        "products",
    )

    ordering = ("-id",)
