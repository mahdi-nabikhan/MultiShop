from django.urls import path, include

urlpatterns = [
    path('api/v1/', include('order.api.v1.urls'))

]
