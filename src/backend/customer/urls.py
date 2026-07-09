from django.urls import path, include

app_name = "customer"
urlpatterns = [
    path("api/v1/", include("customer.api.v1.urls")),
]
