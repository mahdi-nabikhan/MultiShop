from django.contrib import admin

from .models import Conversation, Message


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "customer",
        "store",
        "status",
        "created_at",
        "updated_at",
    )

    list_filter = (
        "status",
        "created_at",
        "store",
    )

    search_fields = (
        "customer__username",
        "customer__email",
        "store__name",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    autocomplete_fields = (
        "customer",
        "store",
    )

    ordering = ("-created_at",)


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "conversation",
        "sender",
        "is_read",
        "is_edited",
        "is_deleted",
        "created_at",
    )

    list_filter = (
        "is_read",
        "is_edited",
        "is_deleted",
        "created_at",
    )

    search_fields = (
        "text",
        "sender__username",
        "conversation__customer__username",
        "conversation__store__name",
    )

    readonly_fields = (
        "created_at",
        "edited_at",
    )

    autocomplete_fields = (
        "conversation",
        "sender",
        "reply_to",
    )

    ordering = ("-created_at",)
    
    
    
    

@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "title",
        "customer",
        "store",
        "created_at",
        "updated_at",
    )

    list_display_links = (
        "id",
        "title",
    )

    search_fields = (
        "title",
        "content",
        "customer__user__username",
        "customer__user__email",
        "store__name",
    )

    list_filter = (
        "created_at",
        "updated_at",
        "store",
    )

    ordering = (
        "-created_at",
    )

    autocomplete_fields = (
        "customer",
        "store",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    date_hierarchy = "created_at"

    list_per_page = 20

    fieldsets = (
        (
            "Ticket Information",
            {
                "fields": (
                    "title",
                    "content",
                )
            },
        ),
        (
            "Relations",
            {
                "fields": (
                    "customer",
                    "store",
                )
            },
        ),
        (
            "Dates",
            {
                "fields": (
                    "created_at",
                    "updated_at",
                )
            },
        ),
    )