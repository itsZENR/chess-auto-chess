from rest_framework.serializers import ModelSerializer 

from django.contrib.auth.models import User


class UserSerializer(ModelSerializer):
    '''
    Сериалайзер
    '''
    class Meta:
        '''
        Meta
        '''
        model = User
        fields = ['username']
