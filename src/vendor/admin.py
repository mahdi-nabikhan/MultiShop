from django.contrib import admin
from .models import Manager, Operator, Admin, Store, ShopAddress, ShopRate

# Register your models here.
admin.site.register(Manager)
admin.site.register(Operator)
admin.site.register(Admin)
admin.site.register(Store)
admin.site.register(ShopAddress)
admin.site.register(ShopRate)
