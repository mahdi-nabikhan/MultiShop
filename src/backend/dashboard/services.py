from vendor.models import Admin, Operator


def can_access_conversation(user, conversation):

    if conversation.customer == user:
        return True

    if conversation.store.manager.user == user:
        return True

    if Admin.objects.filter(
        user=user,
        shop=conversation.store,
    ).exists():
        return True

    if Operator.objects.filter(
        user=user,
        shop=conversation.store,
    ).exists():
        return True

    return False