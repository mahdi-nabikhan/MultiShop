from rest_framework import permissions
from vendor.models import *


class IsManagerPermissions(permissions.BasePermission):

    def has_permission(self, request, view):
        user = request.user

        return  Manager.objects.filter(user=user).exists()


class IsAdminPermissions(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return Admin.objects.filter(user=user).exists()


class IsOperatorPermissions(permissions.BasePermission):
    def has_permission(self, request, view):
        user = request.user
        return Operator.objects.filter(user=user).exists()




class IsManagerOrAdminPermissions(permissions.BasePermission):
    
    def has_permission(self, request, view):
        user = request.user

        return (
            Manager.objects.filter(user=user).exists()
            or Admin.objects.filter(user=user).exists()
        )


class IsVendorStaffPermissions(permissions.BasePermission):

    def has_permission(self, request, view):
        user = request.user

        return (
            Manager.objects.filter(user=user).exists()
            or Admin.objects.filter(user=user).exists()
            or Operator.objects.filter(user=user).exists()
        )
        


class IsStoreOwner(permissions.BasePermission):
    message = "You are not the owner of this store."

    def has_object_permission(self, request, view, obj):
        return obj.manager.user == request.user


class IsProductOwner(permissions.BasePermission):
    message = "You do not have permission to access this product."

    def has_object_permission(self, request, view, obj):
        user = request.user

        return (
            obj.store.manager.user == user
            or obj.store.admin.user == user
        )


class IsProductImageOwner(permissions.BasePermission):
    message = "You do not have permission to access this product image."

    def has_object_permission(self, request, view, obj):
        user = request.user
        product = obj.product

        return (
            product.store.manager.user == user
            or product.store.admin.user == user
        )


class IsDiscountOwner(permissions.BasePermission):
    message = "You do not have permission to access this discount."

    def has_object_permission(self, request, view, obj):
        user = request.user

        if not obj.products:
            return False

        product = obj.products

        return (
            product.store.manager.user == user
            or product.store.admin.user == user
        )


class IsProductRateOwner(permissions.BasePermission):
    message = "You do not have permission to access this product rate."

    def has_object_permission(self, request, view, obj):
        user = request.user
        product = obj.product

        return (
            product.store.manager.user == user
            or product.store.admin.user == user
        )