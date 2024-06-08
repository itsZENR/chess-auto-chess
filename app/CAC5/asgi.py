"""
ASGI config for CAC5 project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os

from channels.auth import AuthMiddlewareStack
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter

from ChessAutoChess import routing


os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'CAC5.settings')

application = get_asgi_application()

application = ProtocolTypeRouter({
    "http": application,
    # "websocket": CookieMiddleware(SessionMiddleware(URLRouter(routing.websocket_urlpatterns))),
    "websocket": AuthMiddlewareStack(URLRouter(routing.websocket_urlpatterns)),
})
