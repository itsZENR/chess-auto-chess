from django.db import models
from django.contrib.auth.models import User

class Game(models.Model):
    '''
    Игры
    '''
    white_player = models.ForeignKey(User, related_name='white_player', on_delete=models.CASCADE)
    black_player = models.ForeignKey(User, related_name='black_player', on_delete=models.CASCADE)
    # white_is_win = models.BooleanField()
    date = models.DateField(auto_now_add=True)
