from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate


def index(request):
    '''
    Аворизация и регистрация пользователя по IP
    '''
    USERNAME = request.META['REMOTE_ADDR']
    user = authenticate(username=USERNAME, password='mypassword')
    if user is not None:
        return HttpResponse(USERNAME)
    else:
        user = User.objects.create_user(USERNAME, 'myemail@crazymail.com', 'mypassword')

        # Обновите поля и сохраните их снова
        user.first_name = 'John'
        user.last_name = 'Citizen'
        user.save()
        return HttpResponse('Пользователь создан')

@login_required
def index(request):
    game = Game(white_player=request.user, black_player=request.user)
    game.save()
    return render(request, "game/game.html", {"room_name": game.pk})
