from django.urls import path, include

app_name = "website"
urlpatterns = [
    path("api/v1/", include("website.api.urls")),
]
