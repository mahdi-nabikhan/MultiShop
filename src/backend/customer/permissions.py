
from rest_framework.permissions import BasePermission


class IsCustomerOwner(BasePermission):
    """
    Allows access only to objects owned by the
    currently authenticated customer.
    """

    def has_object_permission(self, request, view, obj):
        return obj.customer.user == request.user





class IsCommentOwner(BasePermission):

    def has_object_permission(self, request, view, obj):
        return obj.customer.user == request.user