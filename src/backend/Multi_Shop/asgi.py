
import os
from channels.routing import ProtocolTypeRouter,URLRouter
from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
import dashboard.routing
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'Multi_Shop.settings')

application = ProtocolTypeRouter({
    "http":get_asgi_application(),
    "websocket":AuthMiddlewareStack(
        URLRouter(dashboard.routing.websocket_urlpatterns)
    )
    
})
