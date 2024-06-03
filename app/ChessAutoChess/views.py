'''
Логика endpoint'ов на сранице игры
'''
from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
# from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate
from rest_framework.viewsets import ModelViewSet
from ChessAutoChess.models import Game
from ChessAutoChess.serializers import UserSerializer



def index(request):
    '''
    Аворизация и регистрация пользователя по IP
    '''
    username = request.META['REMOTE_ADDR']
    user = authenticate(username=username, password='mypassword')
    # if user is not None:
    #     # return HttpResponse(USERNAME)
    #     # return render(request, "game.html", {"room_name": game.pk})
    #     return render(request, "game.html")
    # else:
    #     user = User.objects.create_user(username, 'myemail@crazymail.com', 'mypassword')

    #     # Обновите поля и сохраните их снова
    #     user.first_name = 'John'
    #     user.last_name = 'Citizen'
    #     user.save()
    #     return render(request, "game.html")
    if user is None:
        user = User.objects.create_user(username, 'myemail@crazymail.com', 'mypassword')

        # Обновите поля и сохраните их снова
        user.first_name = 'John'
        user.last_name = 'Citizen'
        user.save()

    game = Game(white_player=request.user, black_player=request.user)
    game.save()
    return HttpResponse('USERNAME')
    # return render(request, "game/game.html", {"room_name": game.pk})


# @login_required
# def index(request):
#     game = Game(white_player=request.user, black_player=request.user)
#     game.save()
#     return render(request, "game/game.html", {"room_name": game.pk})

class UserView(ModelViewSet):
    '''
    endpoint: 
    '''
    queryset = User.objects.all()
    serializer_class = UserSerializer
