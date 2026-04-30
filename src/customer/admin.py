from django.contrib import admin
from .models import Customer, Address, Comments,ProductRate

# Register your models here.

admin.site.register(Customer)
admin.site.register(Address)
admin.site.register(Comments)

