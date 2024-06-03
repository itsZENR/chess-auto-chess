'''
Регистрация моделей на админ панеле
'''
from django.contrib import admin
from ChessAutoChess.models import Game

admin.site.register(Game)
