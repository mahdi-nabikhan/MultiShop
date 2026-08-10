from rest_framework.permissions import BasePermission

class  IsConversationParticipant(BasePermission):
    """
    Allows access only to users who are either:
    - The customer who owns the conversation
    - The manager of the store associated with the conversation
    """
    
    def has_object_permission(self, request, view, obj):
        if obj.customer == request.user :
            return True
        return obj.store.manager.user == request.user
    
    
    
class IsTicketOwner(BasePermission):
    """
    Allows access only to:
    - The customer who owns the ticket
    - The manager of the store associated with the ticket
    """

    def has_object_permission(self, request, view, obj):
        if obj.customer.user == request.user:
            return True

        return obj.store.manager.user == request.user


class IsReplayTicketOwner(BasePermission):
    """
    Allows access to a ticket reply only if the user has
    access to the parent ticket.
    """

    def has_object_permission(self, request, view, obj):
        ticket = obj.replay_ticket

        if ticket.customer.user == request.user:
            return True

        return ticket.store.manager.user == request.user