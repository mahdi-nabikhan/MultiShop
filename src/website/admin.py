from django.contrib import admin
from .models import Category, Product, ProductImages, ProductRate, Discount

# Register your models here.
admin.site.register(Category)
admin.site.register(Product)
admin.site.register(ProductImages)
admin.site.register(ProductRate)
admin.site.register(Discount)
