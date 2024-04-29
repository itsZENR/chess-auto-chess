from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate


def index(request):
    user = authenticate(username=request.META['HTTP_X_REAL_IP'], password='mypassword')
    if user is not None:
        return HttpResponse(request.META['HTTP_X_REAL_IP'])
    else:
        user = User.objects.create_user(request.META['HTTP_X_REAL_IP'], 'myemail@crazymail.com', 'mypassword')

        # Обновите поля и сохраните их снова
        user.first_name = 'John'
        user.last_name = 'Citizen'
        user.save()
        return HttpResponse('Пользователь создан')
