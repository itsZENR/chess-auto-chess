from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate
from ChessAutoChess.serializers import UserSerializer
from rest_framework.viewsets import ModelViewSet


def index(request):
    '''
    Аворизация и регистрация пользователя по IP
    '''
    USERNAME = request.META['REMOTE_ADDR']
    user = authenticate(username=USERNAME, password='mypassword')
    if user is not None:
        # return HttpResponse(USERNAME)
        # return render(request, "game.html", {"room_name": game.pk})
        return render(request, "game.html")
    else:
        user = User.objects.create_user(USERNAME, 'myemail@crazymail.com', 'mypassword')

        # Обновите поля и сохраните их снова
        user.first_name = 'John'
        user.last_name = 'Citizen'
        user.save()
        return render(request, "game.html")

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
