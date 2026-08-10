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