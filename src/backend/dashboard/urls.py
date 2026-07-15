from django.urls import path, include

app_name = "dashboard"
urlpatterns = [
    path("api/v1/", include("dashboard.api.v1.urls")),
]
