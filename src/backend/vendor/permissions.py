from rest_framework.permissions import BasePermission


class IsStoreOwner(BasePermission):
    """
    Allow only the owner of the store to update or delete it.
    """

    message = "You are not the owner of this store."

    def has_object_permission(self, request, view, obj):

        
        if request.method in ("GET", "HEAD", "OPTIONS"):
            return True

        
        return obj.manager.user == request.user