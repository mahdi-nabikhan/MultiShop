from django.contrib import admin
from .models import Bill, OrderItem, Order

# Register your models here.
admin.site.register(Bill)
admin.site.register(OrderItem)
admin.site.register(Order)
