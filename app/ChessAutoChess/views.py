'''
Логика endpoint'ов на сранице игры
'''

from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.contrib.auth.models import User
# from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login
from rest_framework.viewsets import ModelViewSet
from ChessAutoChess.models import Game
from ChessAutoChess.serializers import UserSerializer



def auth(request):
    '''
    Аворизация и регистрация пользователя по IP
    '''
    username = request.META['REMOTE_ADDR']
    user = authenticate(username=username, password='mypassword')

    if user is None:
        user = User.objects.create_user(username, 'myemail@crazymail.com', 'mypassword')

        # Обновите поля и сохраните их снова
        user.first_name = 'John'
        user.last_name = 'Citizen'
        user.save()
        login(request, user)
        return JsonResponse(
            {'status': 'success',
             'message': 'Authenticated successfully, user was not found and was registered'})
    else:
        login(request, user)
        return JsonResponse(
            {'status': 'success',
             'message': 'Authentication successfully, user found'})



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


class UserView(ModelViewSet):
    '''
    endpoint: 
    '''
    queryset = User.objects.all()
    serializer_class = UserSerializer
