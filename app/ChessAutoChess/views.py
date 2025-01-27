'''
Логика endpoint'ов на сранице игры
'''
from uuid import uuid4

from django.views.generic.base import View
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login

from django.conf import settings
from rest_framework.viewsets import ModelViewSet
from .models import Game
from .serializers import UserSerializer
from django.views.decorators.csrf import (
                                    # ensure_csrf_cookie,
                                    csrf_exempt,
)

from icecream import ic


@csrf_exempt
def auth(request):
    '''
    Аворизация и регистрация пользователя по токену
    '''
    # token = 'undefined'
    token = request.headers.get('TOKEN')
    ic(token)
    if not token:
        token = uuid4()
    user = authenticate(username=token, password='mypassword')
    ic(token)
    if user is None:
        user = User.objects.create_user(token,
                                        'myemail@crazymail.com',
                                        'mypassword')

        # Обновите поля и сохраните их снова
        user.first_name = 'John'
        user.last_name = 'Citizen'
        user.save()
        login(request, user)
        return JsonResponse(
            {'status': 'success',
             'message': 'Authenticated successfully, user was registered',
             'token': token})
    else:
        login(request, user)
        return JsonResponse(
            {'status': 'success',
             'message': 'Authentication successfully, user found',
             'token': token})


@csrf_exempt
@login_required(login_url="/")
def room(request):
    '''
    Создание комнаты
    '''
    game = Game(white_player=request.user, black_player=request.user)
    game.save()
    return JsonResponse(
        {'status': 'success',
         'message': 'Create successfully',
         'room_name': game.pk})


class GameDetail(View):
    '''Отдельная страница игры'''

    # @login_required
    def get(self, request, room_name):
        game = Game.objects.get(id=room_name)
        if not request.user == game.white_player:
            game.black_player = request.user
            game.save()
        return JsonResponse(
            {'status': 'success',
             'message': 'Create successfully',
             'room_name': game.pk})


class UserView(ModelViewSet):
    '''
    endpoint:
    '''
    queryset = User.objects.all()
    serializer_class = UserSerializer

def get_version(request):
    '''
    Получить версию приложения
    '''
    return JsonResponse(
        {'version': f'{settings.RELEASE_NAME}'}
    )