from django.conf import settings
from django.db import models


class Conversation(models.Model):

    class Status(models.TextChoices):
        OPEN = "open", "Open"
        CLOSED = "closed", "Closed"

    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="customer_conversations"
    )

    store = models.ForeignKey(
        "vendor.Store",
        on_delete=models.CASCADE,
        related_name="conversations"
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.OPEN
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    
class Message(models.Model):
    
    conversation = models.ForeignKey(
        Conversation,
        on_delete=models.CASCADE,
        related_name="messages"
    )

    sender = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    text = models.TextField(
        blank=True
    )

    image = models.ImageField(
        upload_to="chat/images/",
        blank=True,
        null=True
    )

    file = models.FileField(
        upload_to="chat/files/",
        blank=True,
        null=True
    )

    reply_to = models.ForeignKey(
        "self",
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name="replies"
    )

    is_read = models.BooleanField(default=False)

    is_edited = models.BooleanField(default=False)

    is_deleted = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    edited_at = models.DateTimeField(
        blank=True,
        null=True
    )

    class Meta:
        ordering = ["created_at"]