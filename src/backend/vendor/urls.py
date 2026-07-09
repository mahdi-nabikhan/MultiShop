from django.urls import path, include

app_name = "vendor"
urlpatterns = [
    path("api/v1/", include("vendor.api.v1.urls")),
]
