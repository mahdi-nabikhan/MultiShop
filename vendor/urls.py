from django.urls import path, include
from .views import *
urlpatterns = [
    path('panel',PanelTemplateView.as_view(),name='panel'),
    path('api/v1/', include('vendor.api.v1.urls'))
]
