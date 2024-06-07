from django.urls import re_path

from ChessAutoChess.consumer import GameConsumer as consumer

# websocket_urlpatterns_chat = [
websocket_urlpatterns = [
    re_path(r"^ws/(?P<room_name>\w+)/$", consumer.as_asgi(), name='room'),
    # re_path(r"^ws$", consumer.as_asgi(), name='room'),
]
