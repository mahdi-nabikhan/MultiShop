
from django.urls import path, include

urlpatterns = [
    path(
        "api/v1/",
        include("website.api.urls", namespace="webste_api_v1"),
    ),
]