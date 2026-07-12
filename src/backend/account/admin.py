
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User, PasswordResetCode


@admin.register(User)
class CustomUserAdmin(UserAdmin):
    model = User

    list_display = (
        "id",
        "email",
        "is_verified",
        "is_staff",
        "is_superuser",
        "is_active",
        "created_date",
    )

    list_filter = (
        "is_verified",
        "is_staff",
        "is_superuser",
        "is_active",
    )

    search_fields = ("email",)
    ordering = ("-created_date",)

    readonly_fields = (
        "created_date",
        "updated_date",
        "last_login",
    )

    fieldsets = (
        (
            "Account Information",
            {
                "fields": (
                    "email",
                    "password",
                )
            },
        ),
        (
            "Permissions",
            {
                "fields": (
                    "is_active",
                    "is_verified",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                )
            },
        ),
        (
            "Important Dates",
            {
                "fields": (
                    "last_login",
                    "created_date",
                    "updated_date",
                )
            },
        ),
    )

    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": (
                    "email",
                    "password1",
                    "password2",
                    "is_active",
                    "is_verified",
                    "is_staff",
                    "is_superuser",
                ),
            },
        ),
    )


@admin.register(PasswordResetCode)
class PasswordResetCodeAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "user",
        "code",
        "created_at",
        "is_expired_status",
    )

    search_fields = (
        "user__email",
        "code",
    )

    list_filter = (
        "created_at",
    )

    readonly_fields = (
        "created_at",
    )

    ordering = ("-created_at",)

    @admin.display(boolean=True, description="Expired")
    def is_expired_status(self, obj):
        return obj.is_expired()

